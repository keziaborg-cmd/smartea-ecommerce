"use client";

import { useEffect, useRef } from "react";
import { track, type TrackProps } from "@/lib/crm/tracker";

// Marcador invisível: dispara o evento uma vez quando a seção entra de fato na tela.
export function SectionViewTracker({ event, properties }: { event: string; properties?: TrackProps }) {
  const ref = useRef<HTMLDivElement>(null);
  const propsJson = JSON.stringify(properties ?? {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          track(event, JSON.parse(propsJson));
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [event, propsJson]);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}
