import Image from "next/image";
import { Leaf } from "lucide-react";
import { TRAIL_STEPS } from "@/data/smartea-mais-content";
import conceitoIcon from "./icones/conceito-i.png";
import autoidentificacaoIcon from "./icones/autoidentificacao-i.png";
import aprofundamentoIcon from "./icones/aprofundamento-i.png";
import ferramentaIcon from "./icones/ferramenta-i.png";
import ritualIcon from "./icones/ritual-i.png";
import conversaIcon from "./icones/conversa-i.png";
import fechamentoIcon from "./icones/fechamento-i.png";

// ilustrações próprias (traço verde, fundo transparente) — uma por passo, na
// mesma ordem de TRAIL_STEPS. Substituem o esquema anterior de ícone-base +
// "accent" em badge (lucide) porque agora cada desenho já é uma composição
// única (ex: ferramenta-i já junta sinal/wifi + broto), não precisa mais
// empilhar dois ícones pra sugerir um conceito composto.
const STEP_ICONS = [conceitoIcon, autoidentificacaoIcon, aprofundamentoIcon, ferramentaIcon, ritualIcon, conversaIcon, fechamentoIcon];

// pontos alternando esquerda/direita (~onde o círculo numerado de cada
// card fica), Y distribuído em porcentagem (0-100) — não pixel fixo por
// linha. Isso é o que permite o viewBox 0-100/0-100 esticar pra QUALQUER
// altura real do container (cards têm altura variável) sem recalcular.
const CURVE_X_LEFT = 16;
const CURVE_X_RIGHT = 84;

type Point = { x: number; y: number };

function buildTrailPoints(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: i % 2 === 0 ? CURVE_X_LEFT : CURVE_X_RIGHT,
    y: count > 1 ? (i / (count - 1)) * 100 : 50,
  }));
}

/** Pontos de controle de um trecho a→b: assimétricos (0.62/0.38 em vez de
 * 0.5/0.5 no meio) pra sair de `a` e chegar em `b` de forma mais vertical
 * antes de virar — dá o efeito de "balanço" mais pronunciado (referência
 * enviada pelo usuário) em vez do S mais raso de controles no meio exato. */
function segmentControlPoints(a: Point, b: Point): [Point, Point] {
  return [
    { x: a.x, y: a.y + (b.y - a.y) * 0.62 },
    { x: b.x, y: a.y + (b.y - a.y) * 0.38 },
  ];
}

function cubicBezierAt(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** De Casteljau: divide uma bezier cúbica em `t`, retornando os pontos de controle das duas metades resultantes. */
function splitCubicBezierAt(p0: Point, p1: Point, p2: Point, p3: Point, t: number) {
  const q1 = lerpPoint(p0, p1, t);
  const q2 = lerpPoint(p1, p2, t);
  const q3 = lerpPoint(p2, p3, t);
  const r0 = lerpPoint(q1, q2, t);
  const r1 = lerpPoint(q2, q3, t);
  const s = lerpPoint(r0, r1, t);
  return { left: [p0, q1, r0, s] as const, right: [s, r1, q3, p3] as const };
}

/** Pontos de controle de SÓ o trecho [t0,t1] da curva original — usado pra desenhar as duas metades de cada segmento com um vão no meio (onde a folha entra), sem perder a curvatura. */
function subCubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t0: number, t1: number) {
  const upToT1 = splitCubicBezierAt(p0, p1, p2, p3, t1).left;
  const u = t0 / t1;
  return splitCubicBezierAt(upToT1[0], upToT1[1], upToT1[2], upToT1[3], u).right;
}

// a linha "para" em CADA folha (não só a do meio) e retoma do outro lado —
// vão de ±GAP_HALF em torno de cada t de LEAF_TS.
const LEAF_TS = [0.28, 0.5, 0.72];
const GAP_HALF = 0.025;

function buildTrailPath(points: Point[]): string {
  const parts: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const [c1, c2] = segmentControlPoints(a, b);
    // corta o trecho em 0/1 nas bordas + ±GAP_HALF ao redor de cada folha,
    // formando pares (início,fim) de cada pedaço de linha visível.
    const cuts = [0, ...LEAF_TS.flatMap((t) => [t - GAP_HALF, t + GAP_HALF]), 1];
    for (let k = 0; k < cuts.length - 1; k += 2) {
      const [t0, t1] = [cuts[k], cuts[k + 1]];
      const [p0, cp1, cp2, p3] = subCubicBezier(a, c1, c2, b, t0, t1);
      parts.push(`M${p0.x},${p0.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p3.x},${p3.y}`);
    }
  }
  return parts.join(" ");
}

/** Ponto sobre a curva "cheia" (sem os vãos) de um trecho — usado só pra posicionar as folhinhas, nunca pro traçado em si. */
function bezierPointOnSegment(a: Point, b: Point, t: number): Point {
  const [c1, c2] = segmentControlPoints(a, b);
  return cubicBezierAt(a, c1, c2, b, t);
}

/** Uma folhinha em CADA ponto de LEAF_TS de cada trecho — é exatamente onde o traçado tem um vão (ver buildTrailPath), então toda folha lê como parte da linha, nunca um acessório solto por cima dela. Giro alternado pra não parecerem carimbadas. */
function buildLeafMarks(points: Point[]): (Point & { rotate: number })[] {
  const marks: (Point & { rotate: number })[] = [];
  const rotations = [10, -14, 6];
  let idx = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (const t of LEAF_TS) {
      const pt = bezierPointOnSegment(points[i], points[i + 1], t);
      marks.push({ ...pt, rotate: rotations[idx % rotations.length] });
      idx++;
    }
  }
  return marks;
}

// forma de "blob" orgânico em vez de círculo perfeito — mesma técnica pro
// painel do ícone (self-stretch, acompanha a altura do texto ao lado) e
// pro card em volta (raio levemente assimétrico), pra ficar consistente
// com a referência visual (nada no site usa blob, então mantive sutil).
const BLOB_RADIUS = "44% 56% 62% 38% / 48% 42% 58% 52%";
const CARD_RADIUS = "36px 36px 36px 14px";

function StepIcon({ src }: { src: (typeof STEP_ICONS)[number] }) {
  return (
    <div
      className="relative flex w-24 shrink-0 items-center justify-center self-stretch bg-folha-viva-clara md:w-28"
      style={{ borderRadius: BLOB_RADIUS }}
    >
      <Image src={src} alt="" className="h-14 w-14 object-contain md:h-16 md:w-16" aria-hidden />
    </div>
  );
}

export function TrailSection() {
  const points = buildTrailPoints(TRAIL_STEPS.length);
  const trailPath = buildTrailPath(points);
  const leafMarks = buildLeafMarks(points);

  return (
    <section className="mx-auto mt-20 max-w-[1100px] px-[6vw] xl:max-w-[1260px] 2xl:max-w-[1440px]">
      <div className="text-center">
        <span className="inline-block rounded-full bg-folha-viva-clara px-4 py-1.5 font-body-mais text-xs font-extrabold uppercase tracking-wide text-folha-viva-escura">
          Passo a passo
        </span>
        <h2 className="mt-3 font-display-mais text-3xl font-bold text-tinta-mais sm:text-4xl">
          Como funciona o dia a dia
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body-mais text-tinta-mais/70">
          Cada dia de jornada é uma trilha curtinha de 7 paradas — do conceito até a conversa com a
          Flora.
        </p>
      </div>

      {/*
        Cada passo é um card com borda ocupando ~metade da largura (fluido,
        `calc(50%-gap)`), alternando de lado a partir do breakpoint md. No
        mobile empilha em coluna única de largura cheia, mas o ícone
        continua à esquerda de cada card (o layout icone+texto em `flex`
        não depende de breakpoint, só a alternância de lado depende).

        Trilha: curva S em SVG com viewBox 0-100/`preserveAspectRatio=
        "none"` (não pixel fixo por linha, se adapta à altura real do
        conteúdo) + folhinhas decorativas nos pontos intermediários do
        caminho, usando o mesmo sistema de coordenadas em porcentagem.
      */}
      <div className="relative mx-auto mt-12 max-w-[900px] xl:max-w-[1150px] 2xl:max-w-[1350px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          aria-hidden
        >
          {/* linha verde clara sólida — a folha (verde escura) marca onde o
              traçado para e retoma, ver buildTrailPath/GAP_HALF acima. */}
          <path
            d={trailPath}
            fill="none"
            stroke="var(--color-folha-viva-clara)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {leafMarks.map((mark, idx) => (
          <Leaf
            key={idx}
            fill="currentColor"
            className="pointer-events-none absolute hidden h-4 w-4 text-folha-viva-escura opacity-90 md:block"
            style={{ left: `${mark.x}%`, top: `${mark.y}%`, transform: `translate(-50%, -50%) rotate(${mark.rotate}deg)` }}
            aria-hidden
          />
        ))}

        <div className="relative flex flex-col gap-5 md:gap-7 xl:gap-8 2xl:gap-9">
          {TRAIL_STEPS.map((step, i) => {
            const onLeft = i % 2 === 0;
            return (
              <div key={step.title} className={`relative flex ${onLeft ? "md:justify-start" : "md:justify-end"}`}>
                <div
                  className="relative w-full border-2 border-tinta-mais/10 bg-white p-4 shadow-sm md:w-[calc(50%-20px)]"
                  style={{ borderRadius: CARD_RADIUS }}
                >
                  <div className="flex gap-4">
                    <StepIcon src={STEP_ICONS[i]} />
                    <div className="min-w-0 flex-1 py-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-folha-viva-escura font-display-mais text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                        <p className="font-display-mais text-lg font-bold text-tinta-mais md:text-xl">{step.title}</p>
                      </div>
                      <div className="mt-2 h-px w-10 bg-tinta-mais/15" />
                      <p className="mt-2 font-body-mais text-sm leading-snug text-tinta-mais/70">{step.text}</p>
                    </div>
                  </div>

                  {/* folhinha decorativa — só em parte dos cards, pra não competir com o conteúdo */}
                  {i % 2 === 1 && (
                    <Leaf
                      className="pointer-events-none absolute bottom-2.5 right-3 h-5 w-5 text-folha-viva opacity-25"
                      aria-hidden
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
