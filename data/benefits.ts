// Conteúdo compartilhado dos 4 cards de benefício mostrados na Home
// ("Sobre resumida") e na página /sobre — mesmo texto nos dois lugares,
// ver components/ui/benefit-card.tsx para a estrutura visual.
export interface BenefitCardData {
  bg: string;
  fg: string;
  title: string;
  text: string;
}

export const BENEFIT_CARDS: BenefitCardData[] = [
  { bg: "bg-verde-escuro", fg: "text-creme", title: "Ritual diário", text: "Um momento seu, todos os dias." },
  { bg: "bg-creme-quente", fg: "text-verde-escuro", title: "Ervas & folhas", text: "Ingredientes naturais, sem aditivos." },
  { bg: "bg-vinho", fg: "text-creme", title: "Sabor de verdade", text: "Blends pensados para o paladar brasileiro." },
  { bg: "bg-verde-escuro", fg: "text-creme", title: "100%", text: "Natural, do início ao fim." },
];
