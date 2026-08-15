"use client";

import type { Tea } from "@/data/teas";
import { useCartStore } from "@/lib/cart/cart-store";
import { useUIStore } from "@/lib/ui/ui-store";
import { trackAddToCart } from "@/lib/tracking/events";

export function AddToCartButton({ tea, className }: { tea: Tea; className?: string }) {
  const add = useCartStore((s) => s.add);
  const showToast = useUIStore((s) => s.showToast);

  return (
    <button
      onClick={() => {
        add(tea.slug, 1);
        showToast(`${tea.name} adicionado ao carrinho`);
        trackAddToCart({ slug: tea.slug, name: tea.name, priceCents: tea.priceCents, qty: 1 });
      }}
      className={className ?? "rounded-pill bg-creme px-8 py-3.5 text-sm font-semibold text-verde-escuro"}
    >
      Adicionar ao carrinho
    </button>
  );
}
