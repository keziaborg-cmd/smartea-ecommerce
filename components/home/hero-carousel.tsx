"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { teas } from "@/data/teas";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const tea = teas[index];

  function go(next: number) {
    setIndex((next + teas.length) % teas.length);
  }

  return (
    <div
      className="relative min-h-0 overflow-hidden rounded-panel px-[22px] py-[26px] transition-[background] duration-500 md:min-h-[660px] md:px-16 md:py-10"
      style={{ background: tea.heroBg }}
    >
      <div className="flex items-center gap-2 text-sm" style={{ color: tea.heroSub }}>
        <span className="shrink-0 font-display text-2xl">{String(index + 1).padStart(2, "0")}</span>
        <span className="eyebrow min-w-0 flex-1 truncate text-center" style={{ color: tea.heroSub }}>
          {tea.chip}
        </span>
        <span className="shrink-0">/ 06</span>
      </div>

      <div className="relative mt-3 flex flex-col items-center justify-center py-6 text-center md:mt-4 md:py-10">
        <span
          key={`word-${tea.slug}`}
          className="animate-hero-wordfade pointer-events-none absolute whitespace-nowrap font-display leading-none opacity-90"
          style={{ color: tea.heroWord, fontSize: "clamp(60px,12vw,180px)" }}
        >
          {tea.name}
        </span>

        <div className="relative z-[2] w-fit -translate-y-2 md:translate-y-0">
          <div
            className="pointer-events-none absolute -inset-[70px] rounded-full blur-[6px]"
            style={{ background: `radial-gradient(circle, ${tea.glow} 0%, rgba(120,190,90,0) 65%)` }}
          />
          <Image
            key={`img-${tea.slug}`}
            src={tea.img}
            alt={tea.name}
            width={320}
            height={320}
            className="animate-hero-arrive animate-floaty relative h-[220px] w-auto drop-shadow-lata sm:h-[260px] md:h-[320px]"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-xl italic" style={{ color: tea.heroWord }}>
          {tea.tag}
        </p>
        <p className="mt-2 text-sm" style={{ color: tea.heroSub }}>
          Chá 100% natural, sem açúcar. <strong>{tea.weight}</strong> · <strong>{tea.price}</strong>
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/produtos/${tea.slug}`}
            className="rounded-pill border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:border-dourado"
          >
            Ver o chá
          </Link>
          <Link
            href="/quiz"
            className="rounded-pill bg-creme px-7 py-3 text-sm font-semibold text-verde-escuro"
          >
            Descobrir meu ritual
          </Link>
        </div>
        <p className="mt-5 text-xs" style={{ color: tea.heroSub }}>
          <span className="mr-2 rounded border border-white/30 px-1.5 py-0.5 font-bold">QR</span>
          Ativa uma jornada de 21 dias no Smartea+, guiada pela Flora
        </p>
      </div>

      <div className="relative z-[5] mt-6 flex items-center justify-center gap-4">
        <button
          aria-label="Anterior"
          onClick={() => go(index - 1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[.45] bg-black/15 text-sm text-white/80 backdrop-blur-[4px] hover:border-dourado md:h-10 md:w-10 md:text-base"
        >
          ←
        </button>
        <div className="flex gap-2">
          {teas.map((t, i) => (
            <button
              key={t.slug}
              aria-label={`Ver ${t.name}`}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? 26 : 8,
                background: i === index ? "#c8a24a" : "rgba(255,255,255,.35)",
              }}
            />
          ))}
        </div>
        <button
          aria-label="Próximo"
          onClick={() => go(index + 1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[.45] bg-black/15 text-sm text-white/80 backdrop-blur-[4px] hover:border-dourado md:h-10 md:w-10 md:text-base"
        >
          →
        </button>
      </div>
    </div>
  );
}
