import type { MetadataRoute } from "next";
import { teas } from "@/data/teas";

const SITE_URL = "https://smartea.com.br";

// Páginas fixas do site + uma entrada por chá (gerado a partir de data/teas.ts,
// então um novo blend adicionado ali já entra no sitemap sem precisar editar
// aqui). Carrinho/checkout/pedido ficam de fora — não fazem sentido indexados
// por buscador (conteúdo transacional/pessoal, não uma página de destino).
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/produtos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/smartea-mais`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = teas.map((tea) => ({
    url: `${SITE_URL}/produtos/${tea.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
