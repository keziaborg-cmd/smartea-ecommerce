// As 4 jornadas reais do app Smartea+, confirmadas pelo usuário em 2026-08-14.
// A relação chá <-> jornada é muitos-para-muitos e vive em `pdp-data.ts`
// (campo `jornadas` de cada chá) — este arquivo só guarda os metadados de
// cada jornada. Não duplicar a lista de chás aqui; usar getTeasForJourney().

export type JourneySlug = "sono" | "ansiedade" | "produtividade" | "compulsividade";

export interface Journey {
  slug: JourneySlug;
  label: string;
  description: string;
}

export const journeys: Journey[] = [
  {
    slug: "sono",
    label: "Sono",
    description: "Um ritual noturno que sinaliza para o corpo que é hora de desacelerar.",
  },
  {
    slug: "ansiedade",
    label: "Ansiedade & Estresse",
    description: "Pausas guiadas ao longo do dia para respirar e reconectar com o presente.",
  },
  {
    slug: "produtividade",
    label: "Produtividade & Foco",
    description: "Energia mais estável e pausas guiadas entre blocos de foco.",
  },
  {
    slug: "compulsividade",
    label: "Compulsividade Alimentar",
    description: "Um intervalo consciente entre a vontade e a ação.",
  },
];

export function journeyLabel(slug: JourneySlug): string {
  return journeys.find((j) => j.slug === slug)?.label ?? slug;
}

export function getJourneyBySlug(slug: JourneySlug): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}
