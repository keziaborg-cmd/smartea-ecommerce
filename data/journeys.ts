// As 4 jornadas reais do app Almara+, confirmadas pelo usuário em 2026-08-14.
// A relação chá <-> jornada é muitos-para-muitos e vive em `pdp-data.ts`
// (campo `jornadas` de cada chá) — este arquivo só guarda os metadados de
// cada jornada. Não duplicar a lista de chás aqui; usar getTeasForJourney().
//
// Os campos `openingQuestion`, `chapters` e `timeline` foram escritos como
// texto editorial placeholder para o redesign de /smartea-mais (2026-08-16,
// a pedido do usuário) — plausíveis, mas provisórios até o conteúdo real do
// app ser confirmado. Revisar antes de publicar.

export type JourneySlug = "sono" | "ansiedade" | "produtividade" | "compulsividade";

export interface Journey {
  slug: JourneySlug;
  label: string;
  description: string;
  openingQuestion: string;
  chapters: string[];
  timeline: {
    day7: string;
    day14: string;
    day21: string;
  };
}

export const journeys: Journey[] = [
  {
    slug: "sono",
    label: "Sono",
    description: "Um ritual noturno que sinaliza para o corpo que é hora de desacelerar.",
    openingQuestion: "Como anda seu sono essa semana?",
    chapters: [
      "Por que a mente não desliga",
      "Ritual noturno com chá",
      "Silenciando a rolagem antes de dormir",
      "Sete dias de constância",
    ],
    timeline: {
      day7: "Primeiros sinais de uma rotina noturna mais leve.",
      day14: "O ritual do chá já virou hábito automático.",
      day21: "Sono mais estável, sem depender de telas para relaxar.",
    },
  },
  {
    slug: "ansiedade",
    label: "Ansiedade",
    description: "Pausas guiadas ao longo do dia para respirar e reconectar com o presente.",
    openingQuestion: "O que mais pesa na sua semana agora?",
    chapters: [
      "Reconhecendo os gatilhos",
      "A pausa de 3 minutos",
      "Respiração guiada com a Mara",
      "Presença em meio à correria",
    ],
    timeline: {
      day7: "As pausas guiadas começam a interromper o piloto automático.",
      day14: "Respirar fundo já é o primeiro reflexo, não o último recurso.",
      day21: "Mais espaço entre o gatilho e a reação.",
    },
  },
  {
    slug: "produtividade",
    label: "Produtividade",
    description: "Energia mais estável e pausas guiadas entre blocos de foco.",
    openingQuestion: "Onde sua energia mais escapa hoje?",
    chapters: [
      "Mapeando seus blocos de foco",
      "Pomodoro com intenção",
      "Pausas que realmente recarregam",
      "Energia estável até o fim do dia",
    ],
    timeline: {
      day7: "Primeiros blocos de foco sem interrupção.",
      day14: "Pausas viram parte do ritmo, não uma interrupção dele.",
      day21: "Foco mais previsível, sem os picos e quedas de antes.",
    },
  },
  {
    // slug mantido como "compulsividade" de propósito: é só um identificador
    // interno de roteamento do site (chaveia pdp-data, cores em globals.css e
    // o progresso do jardim em journeyMilestones.ts). Não há vínculo técnico
    // com o app — renomear é seguro, mas dá churn à toa; só a copy visível
    // foi reescrita, saindo de alegação de saúde para linguagem de ritual.
    slug: "compulsividade",
    label: "Pausa",
    description: "Um intervalo no meio do dia para desacelerar antes de seguir.",
    openingQuestion: "Em que momento do dia você mais sente falta de uma pausa?",
    chapters: [
      "Por que a pausa some da rotina",
      "O intervalo consciente",
      "O chá como pausa, não como recompensa",
      "Escolhas com mais espaço",
    ],
    timeline: {
      day7: "As primeiras pausas conscientes começam a aparecer no dia.",
      day14: "O intervalo do chá já virou parte natural da rotina.",
      day21: "Mais confiança no próprio ritmo ao longo do dia.",
    },
  },
];

export function journeyLabel(slug: JourneySlug): string {
  return journeys.find((j) => j.slug === slug)?.label ?? slug;
}

export function getJourneyBySlug(slug: JourneySlug): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}
