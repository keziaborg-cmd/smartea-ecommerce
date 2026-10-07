import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { mapMpStatusToOrderStatus, type MpPayment } from "./mercadopago.ts";
import { sendOrderConfirmationEmail } from "./email.ts";
import { crmTrack, type CrmTracking } from "./crm.ts";

type OrderStatus = ReturnType<typeof mapMpStatusToOrderStatus>;

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  mp_payment_id: string | null;
  customer_id: string | null;
  nome: string;
  email: string;
  telefone: string;
  total_cents: number;
  coupon_code: string | null;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  shop_order_items: { product_slug: string; product_name: string; qty: number; unit_price_cents: number }[];
}

const ORDER_COLUMNS =
  "id, order_number, status, mp_payment_id, customer_id, nome, email, telefone, total_cents, coupon_code, rua, numero, complemento, bairro, cidade, uf, cep, shop_order_items(product_slug, product_name, qty, unit_price_cents)";

// status do Mercado Pago -> evento do CRM. "rejected" é recusa (emissor/antifraude); erro
// técnico ao criar o pagamento é payment_failed, registrado em shop-process-payment.
export function paymentEventName(status: string, statusDetail: string | null | undefined): string {
  switch (status) {
    case "approved":
      return "payment_approved";
    case "rejected":
      return "payment_refused";
    case "cancelled":
      return statusDetail === "expired" ? "payment_expired" : "payment_cancelled";
    case "refunded":
    case "charged_back":
      return "payment_refunded";
    default:
      return "payment_pending";
  }
}

// Único caminho pra aplicar o estado de um pagamento do Mercado Pago a um pedido — usado tanto
// na resposta síncrona (shop-process-payment) quanto no webhook, pra os dois nunca divergirem.
// Devolve o status do pedido depois da atualização, ou null se o pedido não existe.
export async function applyPaymentUpdate(
  supabase: SupabaseClient,
  payment: MpPayment,
  tracking: CrmTracking = {},
): Promise<OrderStatus | null> {
  const { data, error } = await supabase
    .from("shop_orders")
    .select(ORDER_COLUMNS)
    .eq("order_number", payment.external_reference)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const order = data as unknown as OrderRow;

  const now = new Date().toISOString();
  const mpPaymentId = String(payment.id);
  const amountCents = payment.transaction_amount != null ? Math.round(payment.transaction_amount * 100) : null;

  const { error: attemptError } = await supabase.from("shop_payment_attempts").upsert(
    {
      order_id: order.id,
      mp_payment_id: mpPaymentId,
      payment_method_id: payment.payment_method_id ?? null,
      payment_type_id: payment.payment_type_id ?? null,
      status: payment.status,
      status_detail: payment.status_detail ?? null,
      amount_cents: amountCents,
      updated_at: now,
    },
    { onConflict: "mp_payment_id" },
  );
  if (attemptError) console.error("shop_payment_attempts upsert failed", attemptError.message);

  // Pedido aprovado só muda por causa do próprio pagamento que aprovou (estorno/chargeback) —
  // uma notificação atrasada de outra tentativa (ex.: Pix antigo expirando depois que o cartão
  // aprovou) não pode rebaixar o pedido.
  let orderStatus = mapMpStatusToOrderStatus(payment.status);
  if (order.status === "approved" && order.mp_payment_id !== mpPaymentId) {
    orderStatus = "approved";
  } else {
    const { error: updateError } = await supabase
      .from("shop_orders")
      .update({
        mp_payment_id: mpPaymentId,
        mp_payment_status: payment.status,
        mp_status_detail: payment.status_detail ?? null,
        status: orderStatus,
        updated_at: now,
      })
      .eq("id", order.id);
    if (updateError) throw updateError;
  }

  const who = {
    email: order.email,
    phone: order.telefone,
    personName: order.nome,
    shopCustomerId: order.customer_id,
    anonymousId: tracking.anonymousId,
    sessionId: tracking.sessionId,
  };
  const items = order.shop_order_items.map((i) => ({
    product_id: i.product_slug,
    product_name: i.product_name,
    quantity: i.qty,
    price_cents: i.unit_price_cents,
  }));

  await crmTrack(supabase, {
    ...who,
    name: paymentEventName(payment.status, payment.status_detail),
    properties: {
      order_id: order.id,
      order_number: order.order_number,
      mp_payment_id: mpPaymentId,
      amount_cents: amountCents,
      payment_method: payment.payment_method_id ?? null,
      payment_type: payment.payment_type_id ?? null,
      status: payment.status,
      reason: payment.status_detail ?? null,
    },
    idempotencyKey: `mp:${mpPaymentId}:${payment.status}`,
  });

  if (payment.status === "approved") {
    // Trava atômica: só quem preencher confirmed_at primeiro confirma (o webhook do Mercado Pago
    // reenvia e pode chegar ao mesmo tempo que a resposta síncrona do cartão).
    const { data: won, error: confirmError } = await supabase
      .from("shop_orders")
      .update({ confirmed_at: now })
      .eq("id", order.id)
      .is("confirmed_at", null)
      .select("id");
    if (confirmError) throw confirmError;

    if ((won?.length ?? 0) > 0) {
      const orderProps = {
        order_id: order.id,
        order_number: order.order_number,
        total_cents: order.total_cents,
        coupon: order.coupon_code,
        items,
      };
      await crmTrack(supabase, { ...who, name: "order_confirmed", properties: orderProps, idempotencyKey: `order:${order.order_number}:confirmed` });
      await crmTrack(supabase, { ...who, name: "checkout_completed", properties: orderProps, idempotencyKey: `order:${order.order_number}:checkout_completed` });

      try {
        await sendOrderConfirmationEmail({
          orderNumber: order.order_number,
          customerName: order.nome,
          customerEmail: order.email,
          totalCents: order.total_cents,
          items: order.shop_order_items.map((i) => ({ name: i.product_name, qty: i.qty, unitPriceCents: i.unit_price_cents })),
          shipping: {
            rua: order.rua,
            numero: order.numero,
            complemento: order.complemento,
            bairro: order.bairro,
            cidade: order.cidade,
            uf: order.uf,
            cep: order.cep,
          },
        });
        await crmTrack(supabase, {
          ...who,
          name: "email_sent",
          properties: { template: "order_confirmation", kind: "transactional", order_number: order.order_number },
          idempotencyKey: `order:${order.order_number}:email:confirmation`,
        });
      } catch (emailErr) {
        // Não interrompe a confirmação do pedido — só registra pra investigar depois.
        console.error("order confirmation email failed", emailErr);
      }
    }
  }

  if (payment.status === "refunded" || payment.status === "charged_back") {
    await crmTrack(supabase, {
      ...who,
      name: "order_cancelled",
      properties: { order_id: order.id, order_number: order.order_number, reason: payment.status },
      idempotencyKey: `order:${order.order_number}:cancelled`,
    });
  }

  return orderStatus;
}
