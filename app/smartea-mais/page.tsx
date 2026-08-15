import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journeys, type JourneySlug } from "@/data/journeys";
import { getTeasForJourney } from "@/data/pdp-data";
import { teas, getTeaBySlug, type TeaSlug } from "@/data/teas";
import { QrBadge } from "@/components/ui/qr-badge";
import { StepBadge } from "@/components/checkout/step-badge";

// Chá em destaque por jornada — escolha editorial, não derivada de
// `getTeasForJourney` (os outros chás da jornada continuam listados nas tags).
const FEATURED_TEA_BY_JOURNEY: Record<JourneySlug, TeaSlug> = {
  sono: "camomila",
  ansiedade: "cidreira",
  produtividade: "cha-preto",
  compulsividade: "hibisco",
};

export const metadata: Metadata = {
  title: "Smartea+ — o app que continua sua jornada",
  description:
    "Conheça o Smartea+: a Flora, as jornadas guiadas de 21 dias e como o QR Code de cada lata ativa sua experiência digital.",
};

const FLORA_CARDS = [
  {
    title: "Guia diária",
    text: "Uma mensagem por dia, no seu ritmo, lembrando do seu momento de chá.",
  },
  {
    title: "Lembra do ritual",
    text: "Um toque gentil quando a correria do dia ameaça engolir sua pausa.",
  },
  {
    title: "Ajusta a jornada",
    text: "Acompanha como você está indo e adapta sugestões ao longo dos 21 dias.",
  },
];

const STEPS = [
  { title: "Compre o chá", text: "Escolha o blend que combina com o seu momento — ou faça o quiz." },
  { title: "Escaneie o QR Code", text: "Cada lata Smartea traz um QR Code próprio, impresso na embalagem." },
  { title: "A jornada é ativada", text: "O app reconhece o chá e abre a jornada de 21 dias correspondente." },
  { title: "A Flora guia os 21 dias", text: "Mensagens diárias, lembretes gentis e ajustes no seu ritmo." },
];

export default function SmarteaMaisPage() {
  return (
    <main className="animate-pagein px-[6vw] py-14">
      {/* Hero */}
      <div className="mx-auto max-w-[900px] text-center">
        <p className="eyebrow text-eyebrow-claro">Smartea+</p>
        <h1 className="mt-3 font-display text-[clamp(44px,7vw,80px)] text-verde-escuro">
          Sua jornada continua além da xícara
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-tinta/80">
          Cada lata Smartea traz um QR Code que ativa uma experiência digital: uma jornada guiada de
          21 dias no app Smartea+, com a Flora acompanhando você a cada dia.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-[560px]">
        <div className="flex flex-col items-center gap-3 rounded-panel border-2 border-dashed border-borda-clara-2 bg-gatilho-bg px-8 py-14 text-center">
          <QrBadge size={70} />
          <p className="mt-2 font-display text-xl text-verde-escuro">Prévia do app Smartea+</p>
          <p className="text-sm text-tinta/60">
            Imagens reais do app em breve — este espaço é um placeholder temporário.
          </p>
        </div>
      </div>

      {/* Flora */}
      <div className="mx-auto mt-16 max-w-[1000px] text-center">
        <p className="eyebrow text-eyebrow-claro">Quem guia você</p>
        <h2 className="mt-2 font-display text-3xl text-verde-escuro">Flora, sua companhia de bem-estar</h2>
        <p className="mx-auto mt-3 max-w-lg text-tinta/80">
          Flora é a IA de bem-estar do Smartea+ — uma presença gentil que acompanha seu ritual, não
          um assistente técnico.
        </p>
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          {FLORA_CARDS.map((card) => (
            <div key={card.title} className="rounded-card-conteudo border border-borda-clara bg-white p-6">
              <p className="font-display text-xl text-verde-escuro">{card.title}</p>
              <p className="mt-2 text-sm text-tinta/80">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* As 4 jornadas */}
      <div className="mx-auto mt-16 max-w-[1000px]">
        <div className="text-center">
          <p className="eyebrow text-eyebrow-claro">As jornadas</p>
          <h2 className="mt-2 font-display text-3xl text-verde-escuro">4 jornadas guiadas de 21 dias</h2>
          <p className="mx-auto mt-3 max-w-lg text-tinta/80">
            Um chá pode abrir mais de uma jornada — escolha pelo que você quer cuidar agora.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {journeys.map((journey) => {
            const journeyTeas = getTeasForJourney(journey.slug)
              .map((slug) => teas.find((t) => t.slug === slug))
              .filter((t): t is (typeof teas)[number] => Boolean(t));
            const featuredTea = getTeaBySlug(FEATURED_TEA_BY_JOURNEY[journey.slug]) ?? journeyTeas[0];
            return (
              <div
                key={journey.slug}
                className="flex items-center gap-4 rounded-card-conteudo border border-borda-clara bg-white p-7"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl text-verde-escuro">{journey.label}</p>
                  <p className="mt-2 text-sm text-tinta/80">{journey.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {journeyTeas.map((tea) => (
                      <Link
                        key={tea.slug}
                        href={`/produtos/${tea.slug}`}
                        className="rounded-pill border border-borda-clara px-4 py-1.5 text-sm font-semibold text-verde-folha hover:border-verde-folha"
                      >
                        {tea.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {featuredTea && (
                  <div className="relative w-[84px] shrink-0 sm:w-[104px]">
                    <div
                      className="pointer-events-none absolute -inset-[22px] rounded-full blur-[5px]"
                      style={{ background: `radial-gradient(circle, ${featuredTea.glow} 0%, rgba(120,190,90,0) 65%)` }}
                    />
                    <Image
                      src={featuredTea.img}
                      alt={featuredTea.name}
                      width={160}
                      height={160}
                      className="relative h-[84px] w-auto drop-shadow-lata sm:h-[104px]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Jardim / gamificação */}
      <div className="mx-auto mt-16 max-w-[1000px]">
        <div className="rounded-panel bg-verde-escuro p-8 text-center md:p-12">
          <p className="eyebrow text-dourado">Seu progresso</p>
          <h2 className="mt-2 font-display text-3xl text-creme">Cada dia de ritual faz seu jardim crescer</h2>
          <p className="mx-auto mt-3 max-w-lg text-texto-sobre-escuro">
            No Smartea+, seu progresso na jornada vira um jardim que cresce a cada dia de ritual
            cumprido — um jeito visual e gentil de acompanhar sua constância.
          </p>
        </div>
      </div>

      {/* Como funciona */}
      <div className="mx-auto mt-16 max-w-[1000px]">
        <div className="text-center">
          <p className="eyebrow text-eyebrow-claro">Passo a passo</p>
          <h2 className="mt-2 font-display text-3xl text-verde-escuro">Como funciona na prática</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4 rounded-card-conteudo border border-borda-clara bg-white p-6">
              <StepBadge n={i + 1} />
              <div>
                <p className="font-display text-lg text-verde-escuro">{step.title}</p>
                <p className="mt-1 text-sm text-tinta/80">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <section className="mx-auto mt-16 max-w-[1000px]">
        <div className="rounded-panel bg-verde-escuro px-8 py-16 text-center">
          <h2 className="font-display text-4xl text-creme">Pronto pra começar sua jornada?</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="w-full rounded-pill bg-creme px-8 py-3.5 text-sm font-semibold text-verde-escuro sm:w-auto"
            >
              Ainda não sei qual chá é o meu
            </Link>
            <Link
              href="/produtos"
              className="w-full rounded-pill border border-creme/30 px-8 py-3.5 text-sm font-semibold text-creme hover:border-dourado sm:w-auto"
            >
              Ver todos os chás
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
