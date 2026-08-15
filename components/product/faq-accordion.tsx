"use client";

import { useState } from "react";
import type { PdpFaqItem } from "@/data/pdp-data";

export function FaqAccordion({ items, accentColor }: { items: PdpFaqItem[]; accentColor: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q} className="rounded-card-conteudo border border-borda-clara bg-white p-1">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-tinta">{item.q}</span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                style={{ color: accentColor }}
              >
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-tinta/75">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
