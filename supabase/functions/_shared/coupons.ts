export type CouponCode = "BEM10" | "FRETEZERO";

const VALID_CODES: readonly CouponCode[] = ["BEM10", "FRETEZERO"];

export function normalizeCouponCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidCoupon(code: string): code is CouponCode {
  return (VALID_CODES as readonly string[]).includes(code);
}

export function applyCoupon(
  code: CouponCode,
  subtotalCents: number,
  shippingFeeCents: number,
): { subtotalCents: number; shippingFeeCents: number } {
  if (code === "BEM10") {
    return { subtotalCents: Math.round(subtotalCents * 0.9), shippingFeeCents };
  }
  // FRETEZERO
  return { subtotalCents, shippingFeeCents: 0 };
}
