export type ShippingMethod = "padrao";

const SHIPPING_FEE_CENTS: Record<ShippingMethod, number> = {
  padrao: 1290,
};

export function isShippingMethod(value: unknown): value is ShippingMethod {
  return value === "padrao";
}

export function shippingFeeCents(method: ShippingMethod): number {
  return SHIPPING_FEE_CENTS[method];
}
