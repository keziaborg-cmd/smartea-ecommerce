"use client";

import { track } from "@/lib/crm/tracker";

// GA4 e Meta Pixel (só carregam com consentimento — ver components/providers/tracking-scripts.tsx).
// Os eventos do CRM first-party saem daqui também quando o ponto de disparo é o mesmo; eventos
// de carrinho saem direto da store (lib/cart/cart-store.ts).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(...args);
}

export function trackViewItem(params: { slug: string; name: string; priceCents: number }) {
  track("product_viewed", { product_id: params.slug, product_name: params.name, price_cents: params.priceCents });
  gtag("event", "view_item", {
    currency: "BRL",
    value: params.priceCents / 100,
    items: [{ item_id: params.slug, item_name: params.name }],
  });
  fbq("track", "ViewContent", {
    content_ids: [params.slug],
    content_name: params.name,
    currency: "BRL",
    value: params.priceCents / 100,
  });
}

export function trackAddToCart(params: { slug: string; name: string; priceCents: number; qty: number }) {
  gtag("event", "add_to_cart", {
    currency: "BRL",
    value: (params.priceCents * params.qty) / 100,
    items: [{ item_id: params.slug, item_name: params.name, quantity: params.qty }],
  });
  fbq("track", "AddToCart", {
    content_ids: [params.slug],
    content_name: params.name,
    currency: "BRL",
    value: (params.priceCents * params.qty) / 100,
  });
}

export function trackBeginCheckout(params: { valueCents: number; items: { slug: string; qty: number }[] }) {
  gtag("event", "begin_checkout", {
    currency: "BRL",
    value: params.valueCents / 100,
    items: params.items.map((i) => ({ item_id: i.slug, quantity: i.qty })),
  });
  fbq("track", "InitiateCheckout", {
    content_ids: params.items.map((i) => i.slug),
    currency: "BRL",
    value: params.valueCents / 100,
  });
}

export function trackPurchase(params: { orderNumber: string; valueCents: number; items: { slug: string; qty: number }[] }) {
  gtag("event", "purchase", {
    transaction_id: params.orderNumber,
    currency: "BRL",
    value: params.valueCents / 100,
    items: params.items.map((i) => ({ item_id: i.slug, quantity: i.qty })),
  });
  fbq("track", "Purchase", {
    content_ids: params.items.map((i) => i.slug),
    currency: "BRL",
    value: params.valueCents / 100,
  });
}

export function trackQuizComplete(params: { primarySlug: string; secondarySlug: string }) {
  track("quiz_completed", { primary_result: params.primarySlug, secondary_result: params.secondarySlug });
  gtag("event", "quiz_complete", {
    primary_result: params.primarySlug,
    secondary_result: params.secondarySlug,
  });
  fbq("trackCustom", "QuizComplete", params);
}
