"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { quizData, quizWhy } from "@/data/quiz-data";
import { computeRecommendation, computeComplementary } from "@/lib/quiz/scoring";
import { useCartStore } from "@/lib/cart/cart-store";
import { useUIStore } from "@/lib/ui/ui-store";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppLink } from "@/lib/whatsapp/link";
import { trackAddToCart, trackQuizComplete } from "@/lib/tracking/events";

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const add = useCartStore((s) => s.add);
  const showToast = useUIStore((s) => s.showToast);
  const router = useRouter();

  function pick(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);

    if (step >= quizData.length - 1) {
      setDone(true);
      const primary = computeRecommendation(next);
      const secondary = computeComplementary(next, primary.slug);
      trackQuizComplete({ primarySlug: primary.slug, secondarySlug: secondary.slug });

      const supabase = createClient();
      supabase
        .from("shop_quiz_responses")
        .insert({
          answers: next.map((optionIndex, questionIndex) => ({ questionIndex, optionIndex })),
          primary_result_slug: primary.slug,
          secondary_result_slug: secondary.slug,
        })
        .then(() => {});
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  if (done) {
    const primary = computeRecommendation(answers);
    const secondary = computeComplementary(answers, primary.slug);

    function addAndGoToCart(slug: string, name: string, priceCents: number) {
      add(slug as never, 1);
      showToast(`${name} adicionado ao carrinho`);
      trackAddToCart({ slug, name, priceCents, qty: 1 });
    }

    const whatsappMessage = `Fiz o quiz da Almara e meu chá ideal é o ${primary.name}! ${quizWhy[primary.name]}`;

    return (
      <main className="animate-pagein px-[6vw] py-14">
        <div className="mx-auto max-w-[1120px] rounded-panel bg-verde-escuro p-8 md:p-14 xl:max-w-[1280px] 2xl:max-w-[1440px]">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative flex items-center justify-center">
              <div className="relative w-fit">
                <div
                  className="pointer-events-none absolute -inset-[70px] rounded-full blur-[6px]"
                  style={{ background: `radial-gradient(circle, ${primary.glow} 0%, rgba(120,190,90,0) 65%)` }}
                />
                <Image src={primary.img} alt={primary.name} width={280} height={280} className="animate-floaty relative h-[280px] w-auto drop-shadow-lata" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-dourado">Seu chá ideal</p>
              <h1 className="mt-2 font-display text-5xl text-creme">{primary.name}</h1>
              <p className="mt-3 text-texto-sobre-escuro">{quizWhy[primary.name]}</p>
              <p className="mt-4 text-sm text-texto-sobre-escuro-2">
                {primary.weight} · {primary.price}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => {
                    addAndGoToCart(primary.slug, primary.name, primary.priceCents);
                    router.push("/carrinho");
                  }}
                  className="w-full rounded-pill bg-dourado px-7 py-3 text-center text-sm font-bold text-verde-escuro sm:w-auto"
                >
                  Adicionar ao carrinho
                </button>
                <a
                  href={buildWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-pill bg-whatsapp px-7 py-3 text-center text-sm font-bold text-whatsapp-fg sm:w-auto"
                >
                  Receber esse resultado no WhatsApp
                </a>
              </div>
              <div className="mt-5 flex gap-5 text-sm">
                <button onClick={restart} className="text-texto-sobre-escuro hover:text-creme">
                  ↺ Refazer o quiz
                </button>
                <Link href={`/produtos/${primary.slug}`} className="text-dourado hover:underline">
                  Ver a página do chá →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1120px] rounded-card-conteudo border border-borda-clara bg-white p-7 xl:max-w-[1280px] 2xl:max-w-[1440px]">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
            <div className="flex-1">
              <p className="eyebrow text-eyebrow-claro">Almara+</p>
              <p className="mt-2 font-display text-2xl text-verde-escuro">Sua jornada não termina na xícara</p>
              <p className="mt-1 text-sm text-tinta/70">
                No Almara+ você encontra jornadas guiadas de 21 dias, com a Mara ao seu lado — todas
                disponíveis, para qualquer chá que você escolher.
              </p>
            </div>
            <Link
              href="/smartea-mais"
              className="w-full shrink-0 rounded-pill bg-verde-escuro px-7 py-3 text-center text-sm font-semibold text-creme sm:w-auto"
            >
              Conhecer o Almara+
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1120px] rounded-card-conteudo bg-white p-6 xl:max-w-[1280px] 2xl:max-w-[1440px]">
          <p className="eyebrow text-eyebrow-claro">Também combina com você</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex items-center gap-4">
              <Image src={secondary.img} alt={secondary.name} width={90} height={90} className="h-[90px] w-auto shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl text-verde-escuro">{secondary.name}</p>
                <p className="text-sm italic text-tinta/70">{secondary.tag}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: secondary.priceColor }}>
                  {secondary.price}
                </p>
              </div>
            </div>
            <button
              onClick={() => addAndGoToCart(secondary.slug, secondary.name, secondary.priceCents)}
              className="w-full rounded-pill px-5 py-2.5 text-sm font-semibold sm:w-auto"
              style={{ background: secondary.btnBg, color: secondary.btnFg }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </main>
    );
  }

  const question = quizData[step];

  return (
    <main className="animate-pagein px-[6vw] py-14">
      <div className="mx-auto max-w-[1120px] rounded-panel bg-verde-escuro p-8 md:p-14 xl:max-w-[1280px] 2xl:max-w-[1440px]">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="eyebrow text-eyebrow-escuro">Descubra seu ritual</p>
          <h1 className="mt-3 font-display text-[clamp(34px,5vw,54px)] leading-[1.02] text-creme">
            Qual ritual combina com você?
          </h1>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {quizData.map((_, i) => (
            <span
              key={i}
              className="h-2 w-8 rounded-full"
              style={{ background: i <= step ? "#c8a24a" : "rgba(255,255,255,.2)" }}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-texto-sobre-escuro-2">
          Pergunta {step + 1} de {quizData.length}
        </p>

        <p className="mt-8 text-center font-display text-2xl text-creme">{question.q}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {question.opts.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => pick(i)}
              className="rounded-card-conteudo border border-transparent bg-creme/10 px-5 py-4 text-left text-creme transition hover:border-dourado hover:bg-[rgba(1,63,36,.16)]"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 text-sm text-texto-sobre-escuro hover:text-creme"
          >
            ← Voltar
          </button>
        )}
      </div>
    </main>
  );
}
