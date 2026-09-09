import type { Metadata } from "next";
import Link from "next/link";
import { QrBadge } from "@/components/ui/qr-badge";
import { BenefitCard } from "@/components/ui/benefit-card";
import { BENEFIT_CARDS } from "@/data/benefits";

export const metadata: Metadata = {
  title: "Sobre — Smartea",
  description: "A história da Smartea: um ritual em cada lata.",
};

export default function SobrePage() {
  return (
    <main className="animate-pagein px-[6vw] py-14">
      <div className="mx-auto max-w-[900px] text-center xl:max-w-[1000px] 2xl:max-w-[1100px]">
        <p className="eyebrow text-eyebrow-claro">Nossa história</p>
        <h1 className="mt-3 font-display text-[clamp(44px,7vw,80px)] text-verde-escuro">Um ritual em cada lata</h1>
        <div className="mt-8 flex flex-col gap-5 text-left text-tinta/80">
          <p>
            A Smartea nasceu de uma pergunta simples: e se um chá pudesse ser mais do que uma bebida —
            um convite diário para desacelerar, respirar e cuidar de si?
          </p>
          <p>
            Cada um dos nossos 6 blends é 100% natural, sem açúcar, preparado com ingredientes
            selecionados e pensado para um momento específico do seu dia — da manhã que pede foco à
            noite que pede calma.
          </p>
          <p>
            E cada lata carrega mais do que chá: um QR Code que ativa uma jornada de 21 dias no
            Smartea+, guiada pela Flora, nossa IA de bem-estar — pequenos hábitos, todos os dias.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1000px] flex-col items-start gap-5 rounded-card-conteudo bg-verde-escuro p-7 text-left sm:flex-row sm:items-center xl:max-w-[1140px] 2xl:max-w-[1300px]">
        <QrBadge size={70} />
        <div>
          <p className="font-display text-2xl text-creme">A jornada continua no app</p>
          <p className="mt-1.5 text-texto-sobre-escuro">
            O QR Code de cada lata abre uma jornada de 21 dias no app Smartea+, com a Flora, nossa IA de
            bem-estar, guiando você dia após dia.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-container">
        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFIT_CARDS.map((card) => (
            <BenefitCard key={card.title} card={card} className="p-8" />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/produtos" className="rounded-pill bg-verde-escuro px-8 py-3 text-sm font-semibold text-creme">
            Ver os chás
          </Link>
        </div>
      </div>
    </main>
  );
}
