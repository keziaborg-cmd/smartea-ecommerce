import { makeResponders } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

interface RequestBody {
  orderNumber: string;
  accessToken: string;
}

Deno.serve(async (req) => {
  const { json, preflight } = makeResponders(req);
  const preflightResponse = preflight();
  if (preflightResponse) return preflightResponse;

  try {
    const { orderNumber, accessToken }: RequestBody = await req.json();
    if (!orderNumber || !accessToken) {
      return json({ message: "Requisição inválida." }, 400);
    }

    const supabase = createAdminClient();
    const { data: order, error } = await supabase
      .from("shop_orders")
      .select("order_number, status, total_cents, created_at, shop_order_items(product_name, qty, unit_price_cents)")
      .eq("order_number", orderNumber)
      .eq("access_token", accessToken)
      .maybeSingle();

    if (error) throw error;
    if (!order) return json({ message: "Pedido não encontrado." }, 404);

    return json({
      orderNumber: order.order_number,
      status: order.status,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      items: order.shop_order_items.map((i) => ({
        name: i.product_name,
        qty: i.qty,
        unitPriceCents: i.unit_price_cents,
      })),
    });
  } catch (err) {
    console.error("shop-get-order error", err);
    return json({ message: "Erro ao buscar o pedido." }, 500);
  }
});
