// Mirrors lib/pricing/tiers.ts on the frontend. Kept as a small, separately
// duplicated pure function rather than a shared package — Deno (Edge
// Functions) and Next.js don't share a build pipeline here, and the logic is
// a few lines that's cheap to keep in sync by hand.
export type PriceTier = 1 | 2 | 3;

export function tierForCartUnits(totalUnits: number): PriceTier {
  if (totalUnits >= 3) return 3;
  if (totalUnits === 2) return 2;
  return 1;
}

export function unitPriceForTier(
  tier: PriceTier,
  prices: { price_cents: number; price_tier2_cents: number; price_tier3_cents: number },
): number {
  if (tier === 3) return prices.price_tier3_cents;
  if (tier === 2) return prices.price_tier2_cents;
  return prices.price_cents;
}
