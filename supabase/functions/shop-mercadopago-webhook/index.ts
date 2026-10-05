import { createAdminClient } from "../_shared/supabase-admin.ts";
import { getPayment, mapMpStatusToOrderStatus } from "../_shared/mercadopago.ts";
import { sendOrderConfirmationEmail } from "../_shared/email.ts";

// No CORS/apikey needed — Mercado Pago calls this server-to-server.
// Always re-fetch the payment by id from MP's API rather than trusting the
// notification body, so a forged payload can't inject a fake status.
Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    let type = url.searchParams.get("type") ?? url.searchParams.get("topic");
    let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    if (!paymentId && req.method === "POST") {
      const body = await req.json().catch(() => null);
      type = type ?? body?.type ?? body?.action?.split(".")[0];
      paymentId = paymentId ?? body?.data?.id;
    }

    if (type !== "payment" || !paymentId) {
      return new Response("ok", { status: 200 });
    }

    const payment = await getPayment(paymentId);
    if (!payment.external_reference) {
      return new Response("ok", { status: 200 });
    }

    const supabase = createAdminClient();
    const orderStatus = mapMpStatusToOrderStatus(payment.status);

    const { data: existingOrder, error: fetchError } = await supabase
      .from("shop_orders")
      .select(
        "id, order_number, status, nome, email, total_cents, rua, numero, complemento, bairro, cidade, uf, cep, shop_order_items(product_name, qty, unit_price_cents)",
      )
      .eq("order_number", payment.external_reference)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existingOrder) return new Response("ok", { status: 200 });

    const wasAlreadyApproved = existingOrder.status === "approved";

    // Update guardado por concorrência otimista (`.eq("status", ...)` com o
    // valor que acabou de ser lido): só "vence" a corrida quem encontra o
    // status exatamente como estava — a Mercado Pago reenvia notificação
    // do mesmo pagamento (retry), e isso evita dois webhooks concorrentes
    // disparando o e-mail de confirmação duas vezes pro mesmo pedido.
    const { data: updatedRows, error: updateError } = await supabase
      .from("shop_orders")
      .update({
        mp_payment_id: String(payment.id),
        mp_payment_status: payment.status,
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id)
      .eq("status", existingOrder.status)
      .select("id");

    if (updateError) throw updateError;
    const wonTransition = (updatedRows?.length ?? 0) > 0;

    // Cartão costuma aprovar na hora (mas a Mercado Pago envia webhook pra
    // ele também) e Pix só aprova depois que a pessoa paga de verdade no
    // banco — os dois passam por aqui igual, então o e-mail só sai quando
    // o status realmente vira "approved" pela primeira vez, nunca na
    // criação do pedido.
    if (!wasAlreadyApproved && orderStatus === "approved" && wonTransition) {
      try {
        await sendOrderConfirmationEmail({
          orderNumber: existingOrder.order_number,
          customerName: existingOrder.nome,
          customerEmail: existingOrder.email,
          totalCents: existingOrder.total_cents,
          items: existingOrder.shop_order_items.map((i: { product_name: string; qty: number; unit_price_cents: number }) => ({
            name: i.product_name,
            qty: i.qty,
            unitPriceCents: i.unit_price_cents,
          })),
          shipping: {
            rua: existingOrder.rua,
            numero: existingOrder.numero,
            complemento: existingOrder.complemento,
            bairro: existingOrder.bairro,
            cidade: existingOrder.cidade,
            uf: existingOrder.uf,
            cep: existingOrder.cep,
          },
        });
      } catch (emailErr) {
        // Não interrompe a confirmação do pedido — o status já foi
        // atualizado acima; só registra pra investigar depois.
        console.error("order confirmation email failed", emailErr);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("shop-mercadopago-webhook error", err);
    // Still 200 — MP retries aggressively on non-2xx and we don't want a
    // transient DB hiccup to trigger a storm of redundant retries.
    return new Response("ok", { status: 200 });
  }
});
