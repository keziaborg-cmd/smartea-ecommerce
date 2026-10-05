import { create } from "zustand";
import { persist } from "zustand/middleware";
import { teas, type TeaSlug } from "@/data/teas";
import { tierForCartUnits, unitPriceForTier, type PriceTier } from "@/lib/pricing/tiers";

export type ShippingMethod = "padrao";

const SHIPPING_FEE_CENTS: Record<ShippingMethod, number> = {
  padrao: 1290,
};

export interface CartLine {
  slug: TeaSlug;
  name: string;
  qty: number;
  unitPriceCents: number;
  subtotalCents: number;
}

interface CartState {
  items: Partial<Record<TeaSlug, number>>;
  shippingMethod: ShippingMethod;
  add: (slug: TeaSlug, qty?: number) => void;
  setQty: (slug: TeaSlug, qty: number) => void;
  remove: (slug: TeaSlug) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      shippingMethod: "padrao",
      add: (slug, qty = 1) =>
        set((state) => ({
          items: {
            ...state.items,
            [slug]: (state.items[slug] ?? 0) + qty,
          },
        })),
      setQty: (slug, qty) =>
        set((state) => {
          if (qty <= 0) {
            const rest = { ...state.items };
            delete rest[slug];
            return { items: rest };
          }
          return { items: { ...state.items, [slug]: qty } };
        }),
      remove: (slug) =>
        set((state) => {
          const rest = { ...state.items };
          delete rest[slug];
          return { items: rest };
        }),
      clear: () => set({ items: {} }),
    }),
    { name: "smartea-cart", skipHydration: true },
  ),
);

export function selectCartUnits(items: Partial<Record<TeaSlug, number>>): number {
  return Object.values(items).reduce((sum: number, qty) => sum + (qty ?? 0), 0);
}

export function selectCartTier(items: Partial<Record<TeaSlug, number>>): PriceTier {
  return tierForCartUnits(selectCartUnits(items));
}

export function selectCartLines(items: Partial<Record<TeaSlug, number>>): CartLine[] {
  const tier = selectCartTier(items);
  return teas
    .filter((tea) => (items[tea.slug] ?? 0) > 0)
    .map((tea) => {
      const qty = items[tea.slug]!;
      const unitPriceCents = unitPriceForTier(tier, tea);
      return {
        slug: tea.slug,
        name: tea.name,
        qty,
        unitPriceCents,
        subtotalCents: unitPriceCents * qty,
      };
    });
}

export function selectSubtotalCents(items: Partial<Record<TeaSlug, number>>): number {
  return selectCartLines(items).reduce((sum, line) => sum + line.subtotalCents, 0);
}

export function selectShippingFeeCents(method: ShippingMethod): number {
  return SHIPPING_FEE_CENTS[method];
}

export function formatCentsBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
