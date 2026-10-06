"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore, selectCartUnits } from "@/lib/cart/cart-store";
import { useUIStore } from "@/lib/ui/ui-store";

const LEFT_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/produtos", label: "Produtos" },
  { href: "/quiz", label: "Quiz", accent: true },
  { href: "/smartea-mais", label: "Smartea+" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const items = useCartStore((s) => s.items);
  const [hydrated, setHydrated] = useState(false);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const setContactOpen = useUIStore((s) => s.setContactOpen);

  // Cart count is only correct after the persisted store rehydrates client-side;
  // rendering 0 first avoids an SSR/localStorage markup mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);
  const cartUnits = hydrated ? selectCartUnits(items) : 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-sage/95 px-[6vw] py-[18px] backdrop-blur-md">
        <div className="relative mx-auto flex max-w-container items-center">
          <nav className="hidden items-center gap-7 md:flex">
            {LEFT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.accent
                    ? "text-sm font-extrabold text-vinho"
                    : "text-sm font-medium text-verde-escuro hover:text-verde-folha"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            onClick={() => setMenuOpen(false)}
          >
            <Image src="/logo.png" alt="Smartea" width={69} height={46} className="h-[46px] w-auto" priority />
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="hidden rounded-pill border border-verde-escuro/25 px-5 py-2 text-sm text-verde-escuro hover:border-vinho md:inline-block"
            >
              Contato
            </button>
            <Link
              href="/carrinho"
              className="flex items-center gap-2 rounded-pill border border-verde-escuro/25 px-4 py-2 text-sm text-verde-escuro hover:border-vinho"
            >
              <span aria-hidden>🛒</span>
              <span className="hidden md:inline">Carrinho</span>
              <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-pill bg-creme px-1.5 text-xs font-extrabold text-verde-escuro">
                {cartUnits}
              </span>
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-verde-escuro/25 text-verde-escuro md:hidden"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(20,32,20,.55)] backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="animate-pagein bg-verde-escuro px-[6vw] py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { href: "/", label: "Início" },
              { href: "/sobre", label: "Sobre" },
              { href: "/produtos", label: "Produtos" },
              { href: "/quiz", label: "Fazer o quiz", accent: true },
              { href: "/smartea-mais", label: "Smartea+" },
              { href: "/blog", label: "Blog" },
              { href: "/carrinho", label: "Carrinho" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-creme/10 py-4 text-lg ${
                  link.accent ? "font-extrabold text-dourado" : "text-creme"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                setContactOpen(true);
              }}
              className="block w-full py-4 text-left text-lg text-creme"
            >
              Contato
            </button>
          </div>
        </div>
      )}
    </>
  );
}
