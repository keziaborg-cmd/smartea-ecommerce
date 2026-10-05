import { makeResponders } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";
import { isShippingMethod, shippingFeeCents } from "../_shared/shipping.ts";
import { generateOrderNumber } from "../_shared/order-number.ts";
import { createPreference } from "../_shared/mercadopago.ts";
import { tierForCartUnits, unitPriceForTier } from "../_shared/pricing.ts";
import { applyCoupon, isValidCoupon, normalizeCouponCode } from "../_shared/coupons.ts";

interface RequestBody {
  customer: { nome: string; email: string; telefone: string };
  shipping: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    method: string;
  };
  items: { slug: string; qty: number }[];
  couponCode?: string;
}

Deno.serve(async (req) => {
  const { json, preflight } = makeResponders(req);
  const preflightResponse = preflight();
  if (preflightResponse) return preflightResponse;

  try {
    const body: RequestBody = await req.json();
    const { customer, shipping, items, couponCode } = body;

    if (!customer?.nome || !customer?.email || !customer?.telefone) {
      return json({ message: "Dados de contato incompletos." }, 400);
    }
    if (
      !shipping?.cep || !shipping?.rua || !shipping?.numero ||
      !shipping?.bairro || !shipping?.cidade || !shipping?.uf ||
      !isShippingMethod(shipping.method)
    ) {
      return json({ message: "Endereço de entrega incompleto." }, 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return json({ message: "Carrinho vazio." }, 400);
    }

    const rawCoupon = couponCode?.trim() ?? "";
    const normalizedCoupon = rawCoupon ? normalizeCouponCode(rawCoupon) : "";
    if (rawCoupon && !isValidCoupon(normalizedCoupon)) {
      return json({ message: "Código de desconto inválido." }, 400);
    }

    const supabase = createAdminClient();

    const slugs = items.map((i) => i.slug);
    const { data: products, error: productsError } = await supabase
      .from("shop_products")
      .select("id, slug, name, price_cents, price_tier2_cents, price_tier3_cents")
      .in("slug", slugs)
      .eq("active", true);

    if (productsError) throw productsError;

    const productBySlug = new Map(products.map((p) => [p.slug, p]));
    for (const item of items) {
      if (!productBySlug.has(item.slug) || item.qty < 1) {
        return json({ message: `Item inválido: ${item.slug}.` }, 400);
      }
    }

    // Volume-discount tier is decided by total units across the whole cart
    // (any mix of flavors) — never trust a tier/price sent by the client.
    const totalUnits = items.reduce((sum, item) => sum + item.qty, 0);
    const tier = tierForCartUnits(totalUnits);

    const orderItems = items.map((item) => {
      const product = productBySlug.get(item.slug)!;
      const unitPriceCents = unitPriceForTier(tier, product);
      const subtotalCents = unitPriceCents * item.qty;
      return {
        product_id: product.id,
        product_slug: product.slug,
        product_name: product.name,
        unit_price_cents: unitPriceCents,
        qty: item.qty,
        subtotal_cents: subtotalCents,
      };
    });

    const rawSubtotalCents = orderItems.reduce((sum, i) => sum + i.subtotal_cents, 0);
    const rawShippingFee = shippingFeeCents(shipping.method);
    const { subtotalCents, shippingFeeCents: shippingFee } = normalizedCoupon
      ? applyCoupon(normalizedCoupon, rawSubtotalCents, rawShippingFee)
      : { subtotalCents: rawSubtotalCents, shippingFeeCents: rawShippingFee };
    const totalCents = subtotalCents + shippingFee;

    const { data: existingCustomer } = await supabase
      .from("shop_customers")
      .select("id")
      .eq("email", customer.email)
      .maybeSingle();

    let customerId: string;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      await supabase
        .from("shop_customers")
        .update({ nome: customer.nome, telefone: customer.telefone, updated_at: new Date().toISOString() })
        .eq("id", customerId);
    } else {
      const { data: inserted, error: insertCustomerError } = await supabase
        .from("shop_customers")
        .insert({ nome: customer.nome, email: customer.email, telefone: customer.telefone })
        .select("id")
        .single();
      if (insertCustomerError) throw insertCustomerError;
      customerId = inserted.id;
    }

    let orderNumber = generateOrderNumber();
    let order;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from("shop_orders")
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          nome: customer.nome,
          email: customer.email,
          telefone: customer.telefone,
          cep: shipping.cep,
          rua: shipping.rua,
          numero: shipping.numero,
          complemento: shipping.complemento ?? null,
          bairro: shipping.bairro,
          cidade: shipping.cidade,
          uf: shipping.uf,
          shipping_method: shipping.method,
          shipping_fee_cents: shippingFee,
          subtotal_cents: subtotalCents,
          total_cents: totalCents,
          status: "pending",
        })
        .select("id, order_number, access_token")
        .single();

      if (!error) {
        order = data;
        break;
      }
      if (error.code === "23505") {
        orderNumber = generateOrderNumber();
        continue;
      }
      throw error;
    }
    if (!order) throw new Error("Não foi possível gerar um número de pedido único.");

    const itemsToInsert = orderItems.map((i) => ({ ...i, order_id: order.id }));
    const { error: itemsError } = await supabase.from("shop_order_items").insert(itemsToInsert);
    if (itemsError) throw itemsError;

    const functionsBaseUrl = Deno.env.get("SUPABASE_URL")!.replace(".supabase.co", ".functions.supabase.co");
    const preference = await createPreference({
      items: orderItems.map((i) => ({
        id: i.product_slug,
        title: i.product_name,
        quantity: i.qty,
        unit_price: i.unit_price_cents / 100,
        currency_id: "BRL",
      })),
      externalReference: order.order_number,
      notificationUrl: `${functionsBaseUrl}/shop-mercadopago-webhook`,
      payerEmail: customer.email,
    });

    await supabase
      .from("shop_orders")
      .update({ mp_preference_id: preference.id })
      .eq("id", order.id);

    return json({
      orderNumber: order.order_number,
      accessToken: order.access_token,
      preferenceId: preference.id,
      amount: totalCents / 100,
    });
  } catch (err) {
    console.error("shop-create-order error", err);
    return json({ message: "Erro ao criar o pedido." }, 500);
  }
});
