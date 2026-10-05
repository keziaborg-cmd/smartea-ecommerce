import { makeResponders } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";
import { createPayment, mapMpStatusToOrderStatus } from "../_shared/mercadopago.ts";

interface RequestBody {
  orderNumber: string;
  accessToken: string;
  formData: Record<string, unknown>;
}

Deno.serve(async (req) => {
  const { json, preflight } = makeResponders(req);
  const preflightResponse = preflight();
  if (preflightResponse) return preflightResponse;

  try {
    const { orderNumber, accessToken, formData }: RequestBody = await req.json();
    if (!orderNumber || !accessToken || !formData) {
      return json({ message: "Requisição inválida." }, 400);
    }

    const supabase = createAdminClient();

    const { data: order, error: orderError } = await supabase
      .from("shop_orders")
      .select("id, order_number, status, mp_payment_id")
      .eq("order_number", orderNumber)
      .eq("access_token", accessToken)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return json({ message: "Pedido não encontrado." }, 404);

    if (order.status === "approved") {
      return json({ status: "approved" });
    }

    const functionsBaseUrl = Deno.env.get("SUPABASE_URL")!.replace(".supabase.co", ".functions.supabase.co");
    const payment = await createPayment({
      formData,
      externalReference: order.order_number,
      notificationUrl: `${functionsBaseUrl}/shop-mercadopago-webhook`,
      idempotencyKey: `${order.id}:${Date.now()}`,
    });

    const orderStatus = mapMpStatusToOrderStatus(payment.status);

    await supabase
      .from("shop_orders")
      .update({
        mp_payment_id: String(payment.id),
        mp_payment_status: payment.status,
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (orderStatus === "rejected") {
      return json({
        status: "rejected",
        message: "Pagamento recusado. Verifique os dados e tente novamente.",
      });
    }

    // Pix vem "pending" na criação — a pessoa ainda precisa escanear/pagar
    // o QR Code. Repassa os dados prontos que o Mercado Pago já devolve
    // (nenhuma chamada extra necessária) pro frontend poder mostrá-los.
    const transactionData = payment.point_of_interaction?.transaction_data;
    const pix = transactionData?.qr_code
      ? {
          qrCode: transactionData.qr_code,
          qrCodeBase64: transactionData.qr_code_base64 ?? null,
          expiresAt: payment.date_of_expiration ?? null,
        }
      : undefined;

    return json({ status: orderStatus, mpPaymentId: payment.id, pix });
  } catch (err) {
    console.error("shop-process-payment error", err);
    return json({ message: "Erro ao processar o pagamento." }, 500);
  }
});
