import { createAdminClient } from "../_shared/supabase-admin.ts";
import { getPayment, mapMpStatusToOrderStatus } from "../_shared/mercadopago.ts";

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

    await supabase
      .from("shop_orders")
      .update({
        mp_payment_id: String(payment.id),
        mp_payment_status: payment.status,
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", payment.external_reference);

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("shop-mercadopago-webhook error", err);
    // Still 200 — MP retries aggressively on non-2xx and we don't want a
    // transient DB hiccup to trigger a storm of redundant retries.
    return new Response("ok", { status: 200 });
  }
});
