"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/tracking/events";

export function ViewItemTracker({ slug, name, priceCents }: { slug: string; name: string; priceCents: number }) {
  useEffect(() => {
    trackViewItem({ slug, name, priceCents });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
