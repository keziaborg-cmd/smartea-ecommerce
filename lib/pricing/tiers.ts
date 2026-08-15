// Volume-discount tier: determined by the TOTAL number of tea units in the
// cart across every product (mixing flavors counts), not by how many of one
// specific product are in the cart. Each unit is then priced at that tier's
// price for its own product.
export type PriceTier = 1 | 2 | 3;

export function tierForCartUnits(totalUnits: number): PriceTier {
  if (totalUnits >= 3) return 3;
  if (totalUnits === 2) return 2;
  return 1;
}

export function unitPriceForTier(
  tier: PriceTier,
  prices: { priceCents: number; priceTier2Cents: number; priceTier3Cents: number },
): number {
  if (tier === 3) return prices.priceTier3Cents;
  if (tier === 2) return prices.priceTier2Cents;
  return prices.priceCents;
}
