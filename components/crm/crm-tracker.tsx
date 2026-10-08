"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsentStore } from "@/lib/consent/consent";
import { track } from "@/lib/crm/tracker";

function pageType(path: string): string {
  if (path === "/") return "home";
  if (path === "/produtos") return "category";
  if (path.startsWith("/produtos/")) return "product";
  if (path === "/blog") return "blog";
  if (path.startsWith("/blog/autor/")) return "blog_author";
  if (path.startsWith("/blog/")) return "blog_article";
  if (path === "/carrinho") return "cart";
  if (path.startsWith("/pedido/")) return "order";
  if (path === "/sobre") return "about";
  if (path === "/suporte") return "support";
  if (path === "/quiz") return "quiz";
  if (path === "/almara-mais") return "landing";
  return "other";
}

function trackPage(path: string) {
  const type = pageType(path);
  track("page_view", { path, page_type: type });
  if (type === "category") track("category_viewed", { category: "todos", path });
  if (type === "about") track("about_brand_viewed", { path });
  if (type === "support") track("contact_viewed", { via: "page" });
}

function classifyLink(anchor: HTMLAnchorElement): { name: string; props: Record<string, unknown> } | null {
  const href = anchor.getAttribute("href") ?? "";
  const label = (anchor.textContent ?? "").trim().slice(0, 80);
  const where = location.pathname;
  if (href.startsWith("mailto:")) return { name: "contact_clicked", props: { channel: "email", location: where } };
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return null;
  }
  if (/(^|\.)wa\.me$|whatsapp\.com$/.test(url.hostname)) {
    return { name: "whatsapp_clicked", props: { location: where, label } };
  }
  if (/(^|\.)instagram\.com$/.test(url.hostname)) {
    return { name: "instagram_clicked", props: { location: where, label } };
  }
  if ((url.protocol === "http:" || url.protocol === "https:") && url.host !== location.host) {
    return { name: "external_link_clicked", props: { location: where, host: url.hostname, path: url.pathname, label } };
  }
  return null;
}

// Page view a cada troca de rota + cliques em links de WhatsApp, Instagram, e-mail e externos, e
// em qualquer elemento marcado com data-crm-banner="nome".
export function CrmTracker() {
  const pathname = usePathname();
  const consentLoaded = useConsentStore((s) => s.loaded);
  const analytics = useConsentStore((s) => s.choice?.analytics === true);

  useEffect(() => {
    if (!consentLoaded) return;
    trackPage(pathname);
    // `analytics` na dependência: quem aceita os cookies agora conta a página em que está.
  }, [pathname, consentLoaded, analytics]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const banner = target?.closest<HTMLElement>("[data-crm-banner]");
      if (banner) track("banner_clicked", { banner: banner.dataset.crmBanner, location: location.pathname });
      const anchor = target?.closest("a");
      if (!anchor) return;
      const event = classifyLink(anchor);
      if (event) track(event.name, event.props);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
