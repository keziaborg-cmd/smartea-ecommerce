/**
 * GardenDemoLoop — versão de marketing da cena progressiva do jardim,
 * pra usar dentro de um card (ex: FeatureRow de components/smartea-mais/
 * features-section.tsx). Não é a cena pesada em si — é um wrapper que
 * decide QUANDO carregar e animar ela:
 *
 * - `next/dynamic({ ssr: false })` no `GardenDemoScene` (o Canvas de
 *   verdade, em arquivo separado). Isso é OBRIGATÓRIO vir de um Client
 *   Component — confirmado na doc desta versão do Next
 *   (node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md):
 *   "`ssr: false` is not allowed with `next/dynamic` in Server
 *   Components." `features-section.tsx` é Server Component, por isso
 *   esse wrapper existe como peça separada.
 * - IntersectionObserver: a cena 3D só é MONTADA (dispara o fetch de
 *   garden.glb, ~8MB) na primeira vez que o card entra no viewport —
 *   antes disso mostra `fallback`. Depois de montada uma vez, fica
 *   montada (não recarrega o glb de novo), mas a prop `active` pausa o
 *   relógio de animação sempre que o card sai da tela de novo.
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const GardenDemoScene = dynamic(() => import("./GardenDemoScene"), {
  ssr: false,
  loading: () => null,
});

type GardenDemoLoopProps = {
  /** Mostrado antes do card entrar no viewport pela 1ª vez (ex: a ilustração estática que esse componente substitui). */
  fallback?: ReactNode;
  className?: string;
};

const DEFAULT_FALLBACK = (
  <div className="h-full w-full animate-pulse rounded-2xl bg-black/5" aria-hidden />
);

export function GardenDemoLoop({ fallback = DEFAULT_FALLBACK, className }: GardenDemoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasLoaded(true);
      },
      { rootMargin: "200px", threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-[320px] w-full max-w-[420px] overflow-hidden rounded-2xl md:h-[380px]"}
    >
      {hasLoaded ? <GardenDemoScene active={inView} /> : fallback}
    </div>
  );
}
