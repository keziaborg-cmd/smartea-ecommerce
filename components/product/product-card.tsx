"use client";

import Link from "next/link";
import Image from "next/image";
import type { Tea } from "@/data/teas";
import { useCartStore, formatCentsBRL } from "@/lib/cart/cart-store";
import { useUIStore } from "@/lib/ui/ui-store";
import { trackAddToCart } from "@/lib/tracking/events";

export function ProductCard({ tea, size = "default" }: { tea: Tea; size?: "default" | "small" }) {
  const add = useCartStore((s) => s.add);
  const showToast = useUIStore((s) => s.showToast);

  function handleAdd() {
    add(tea.slug, 1);
    showToast(`${tea.name} adicionado ao carrinho`);
    trackAddToCart({ slug: tea.slug, name: tea.name, priceCents: tea.priceCents, qty: 1 });
  }

  return (
    <div
      className="relative overflow-hidden rounded-card-produto p-6 text-center"
      style={{ background: tea.cardBg }}
    >
      <Link href={`/produtos/${tea.slug}`} className="relative block">
        <div className="relative mx-auto w-fit">
          <div
            className="pointer-events-none absolute -inset-[70px] rounded-full blur-[6px]"
            style={{ background: `radial-gradient(circle, ${tea.glow} 0%, rgba(120,190,90,0) 65%)` }}
          />
          <Image
            src={tea.img}
            alt={tea.name}
            width={size === "small" ? 190 : 270}
            height={size === "small" ? 190 : 270}
            className="relative mx-auto drop-shadow-card-produto"
            style={{ height: size === "small" ? 190 : 270, width: "auto" }}
          />
        </div>
        <h3 className="mt-3 font-display text-2xl" style={{ color: tea.nameColor }}>
          {tea.name}
        </h3>
        <p className="mt-1 text-sm italic" style={{ color: tea.subColor }}>
          {tea.tag}
        </p>
      </Link>
      <div className="relative mt-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl" style={{ color: tea.priceColor }}>
            {tea.price}
          </span>
          <button
            onClick={handleAdd}
            className="rounded-pill px-5 py-2 text-sm font-semibold"
            style={{ background: tea.btnBg, color: tea.btnFg }}
          >
            Adicionar
          </button>
        </div>
        <p className="mt-1.5 text-xs" style={{ color: tea.subColor }}>
          A partir de {formatCentsBRL(tea.priceTier3Cents)} · compre mais, pague menos
        </p>
      </div>
    </div>
  );
}
