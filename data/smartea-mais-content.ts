// Conteúdo específico da página /smartea-mais (redesign gamificado,
// 2026-08-16). Separado de journeys.ts porque não é metadado de jornada —
// é o conteúdo fixo das seções "como funciona o dia a dia" e "ferramentas".

export const TRAIL_STEPS = [
  { title: "Conceito", text: "Um conceito novo de bem-estar, direto ao ponto, pra abrir o dia." },
  { title: "Autoidentificação", text: "Você se reconhece na situação — é aqui que o dia começa a fazer sentido." },
  { title: "Aprofundamento", text: "Vai um pouco mais fundo no porquê, sem enrolação." },
  { title: "Seu ecossistema", text: "As ferramentas do seu ecossistema de bem-estar, prontas pra aplicar agora." },
  { title: "Ritual do chá", text: "A pausa física: seu chá do dia, o momento pra respirar de verdade." },
  { title: "Conversa com a Flora", text: "Um bate-papo curto pra fechar o que ficou de aprendizado." },
  { title: "Fechamento", text: "Um resumo do dia e um gentil convite pra amanhã." },
] as const;

export type ToolIcon = "pomodoro" | "respiracao" | "wimhof" | "tarefas" | "habitos" | "diario";

export const TOOLS: {
  icon: ToolIcon;
  label: string;
  description: string;
  /** Copy curta "gatilho → solução", revelada no hover/toque do card. */
  scene: string;
  /** Selo discreto pra 1-2 ferramentas mais usadas — omitido nas demais. */
  badge?: string;
}[] = [
  {
    icon: "pomodoro",
    label: "Pomodoro",
    description: "Blocos de foco com pausas curtas no meio.",
    scene: "Travou no meio da tarefa? 25 min de foco resolvem.",
  },
  {
    icon: "respiracao",
    label: "Respiração guiada",
    description: "Exercícios de respiração pra acalmar na hora.",
    scene: "Ansiedade batendo antes da reunião? 2 min acalmam.",
    badge: "Favorita da galera",
  },
  {
    icon: "wimhof",
    label: "Wim Hof",
    description: "Respiração e frio pra dar um gás de energia.",
    scene: "Precisando de um gás de energia rápido? É pra isso.",
  },
  {
    icon: "tarefas",
    label: "Lista de tarefas",
    description: "Anote o que precisa fazer e vá riscando.",
    scene: "Cabeça cheia de coisa pra lembrar? Anota e esquece.",
  },
  {
    icon: "habitos",
    label: "Hábitos",
    description: "Marque os hábitos que quer manter todo dia.",
    scene: "Quer criar uma rotina que gruda? Comece pequeno, aqui.",
    badge: "Mais usada",
  },
  {
    icon: "diario",
    label: "Diário",
    description: "Um espaço pra escrever como você está.",
    scene: "Dia difícil? Um espaço só seu pra desabafar.",
  },
];

export const ACHIEVEMENTS = [
  { value: "4", label: "jornadas guiadas" },
  { value: "21", label: "dias por jornada" },
  { value: "6", label: "ferramentas no app" },
  { value: "12", label: "itens de jardim" },
];
