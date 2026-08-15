export type ShippingMethod = "padrao" | "retirada";

const SHIPPING_FEE_CENTS: Record<ShippingMethod, number> = {
  padrao: 1290,
  retirada: 0,
};

export function isShippingMethod(value: unknown): value is ShippingMethod {
  return value === "padrao" || value === "retirada";
}

export function shippingFeeCents(method: ShippingMethod): number {
  return SHIPPING_FEE_CENTS[method];
}
