import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // carrinho/checkout/pedido são páginas transacionais/pessoais — não
      // fazem sentido indexadas (nem aparecem no sitemap, ver app/sitemap.ts).
      disallow: ["/carrinho", "/pedido/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
