import type { JourneySlug } from "./journeys";

// As 4 categorias do blog batem com as 4 jornadas de 21 dias do app — mas
// "pausa" é o nome público atual; o slug interno da jornada continua
// "compulsividade" (ver data/journeys.ts, renomeado por exigência regulatória
// em 2026-08, não desfeito aqui). BLOG_CATEGORY_TO_JOURNEY_SLUG é o único
// lugar que faz essa ponte, pra não espalhar esse detalhe pelo resto do blog.
export type BlogCategory = "sono" | "ansiedade" | "produtividade" | "pausa";

export const BLOG_CATEGORIES: BlogCategory[] = ["sono", "ansiedade", "produtividade", "pausa"];

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  sono: "Sono",
  ansiedade: "Ansiedade",
  produtividade: "Produtividade",
  pausa: "Pausa",
};

export const BLOG_CATEGORY_TO_JOURNEY_SLUG: Record<BlogCategory, JourneySlug> = {
  sono: "sono",
  ansiedade: "ansiedade",
  produtividade: "produtividade",
  pausa: "compulsividade",
};

// Tokens de cor por categoria — reusa os mesmos `--color-jornada-*` já
// definidos em app/globals.css pras jornadas no Almara+, pra consistência
// visual entre o app, a página /almara-mais e o blog.
export const BLOG_CATEGORY_STYLE: Record<BlogCategory, { solid: string; clara: string; escura: string }> = {
  sono: { solid: "bg-jornada-sono", clara: "bg-jornada-sono-clara", escura: "text-jornada-sono-escura" },
  ansiedade: { solid: "bg-jornada-ansiedade", clara: "bg-jornada-ansiedade-clara", escura: "text-jornada-ansiedade-escura" },
  produtividade: { solid: "bg-jornada-produtividade", clara: "bg-jornada-produtividade-clara", escura: "text-jornada-produtividade-escura" },
  pausa: { solid: "bg-jornada-pausa", clara: "bg-jornada-pausa-clara", escura: "text-jornada-pausa-escura" },
};

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as string[]).includes(value);
}
