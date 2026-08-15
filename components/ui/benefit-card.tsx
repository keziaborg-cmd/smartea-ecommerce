import type { BenefitCardData } from "@/data/benefits";

export function BenefitCard({ card, className = "" }: { card: BenefitCardData; className?: string }) {
  return (
    <div className={`${card.bg} ${card.fg} rounded-card-conteudo ${className}`}>
      <p className="font-display text-2xl">{card.title}</p>
      <p className="mt-1 text-sm opacity-85">{card.text}</p>
    </div>
  );
}
