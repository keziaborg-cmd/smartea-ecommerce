export type CouponCode = "BEM10" | "FRETEZERO" | "KZTEST80X9";

// TEMPORARY — KZTEST80X9 is a one-off internal test coupon (Mercado Pago
// retention test in production). Remove this code + its branch below (and
// the mirrored copy in lib/cart/coupons.ts) once the test is confirmed done
// — do not leave it live permanently.
const VALID_CODES: readonly CouponCode[] = ["BEM10", "FRETEZERO", "KZTEST80X9"];

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
  if (code === "KZTEST80X9") {
    return { subtotalCents: Math.round(subtotalCents * 0.2), shippingFeeCents: 0 };
  }
  // FRETEZERO
  return { subtotalCents, shippingFeeCents: 0 };
}
