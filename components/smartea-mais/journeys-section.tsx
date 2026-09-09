import Image from "next/image";
import Link from "next/link";
import { journeys, type JourneySlug } from "@/data/journeys";
import { getTeasForJourney } from "@/data/pdp-data";
import { teas, getTeaBySlug, type TeaSlug } from "@/data/teas";

const FEATURED_TEA_BY_JOURNEY: Record<JourneySlug, TeaSlug> = {
  sono: "camomila",
  ansiedade: "cidreira",
  produtividade: "cha-preto",
  compulsividade: "hibisco",
};

const JOURNEY_STYLE: Record<
  JourneySlug,
  { clara: string; solid: string; escura: string; text: string; chip: string }
> = {
  sono: {
    clara: "bg-jornada-sono-clara",
    solid: "bg-jornada-sono",
    escura: "bg-jornada-sono-escura",
    text: "text-jornada-sono-escura",
    chip: "border-jornada-sono-escura/25 text-jornada-sono-escura",
  },
  ansiedade: {
    clara: "bg-jornada-ansiedade-clara",
    solid: "bg-jornada-ansiedade",
    escura: "bg-jornada-ansiedade-escura",
    text: "text-jornada-ansiedade-escura",
    chip: "border-jornada-ansiedade-escura/25 text-jornada-ansiedade-escura",
  },
  produtividade: {
    clara: "bg-jornada-produtividade-clara",
    solid: "bg-jornada-produtividade",
    escura: "bg-jornada-produtividade-escura",
    text: "text-jornada-produtividade-escura",
    chip: "border-jornada-produtividade-escura/25 text-jornada-produtividade-escura",
  },
  compulsividade: {
    clara: "bg-jornada-pausa-clara",
    solid: "bg-jornada-pausa",
    escura: "bg-jornada-pausa-escura",
    text: "text-jornada-pausa-escura",
    chip: "border-jornada-pausa-escura/25 text-jornada-pausa-escura",
  },
};

export function JourneysSection() {
  return (
    <section className="mx-auto mt-20 max-w-[1100px] px-[6vw] xl:max-w-[1260px] 2xl:max-w-[1440px]">
      <div className="text-center">
        <span className="inline-block rounded-full bg-folha-viva-clara px-4 py-1.5 font-body-mais text-xs font-extrabold uppercase tracking-wide text-folha-viva-escura">
          As jornadas
        </span>
        <h2 className="mt-3 font-display-mais text-3xl font-bold text-tinta-mais sm:text-4xl">
          4 jornadas guiadas de 21 dias
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body-mais text-tinta-mais/70">
          Um chá pode abrir mais de uma jornada — escolha pelo que você quer cuidar agora.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {journeys.map((journey) => {
          const style = JOURNEY_STYLE[journey.slug];
          const journeyTeas = getTeasForJourney(journey.slug)
            .map((slug) => teas.find((t) => t.slug === slug))
            .filter((t): t is (typeof teas)[number] => Boolean(t));
          const featuredTea = getTeaBySlug(FEATURED_TEA_BY_JOURNEY[journey.slug]) ?? journeyTeas[0];

          return (
            <div key={journey.slug} className="relative">
              {featuredTea && (
                <Image
                  src={featuredTea.img}
                  alt={featuredTea.name}
                  width={200}
                  height={200}
                  className="animate-floaty pointer-events-none absolute -right-1 -top-7 z-10 h-[100px] w-auto rotate-12 drop-shadow-xl sm:-right-3 sm:-top-9 sm:h-[150px]"
                />
              )}
              <div className={`relative overflow-hidden rounded-[32px] p-7 ${style.clara} sm:p-8`}>
                <div className={`pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full opacity-30 blur-2xl ${style.solid}`} />
                <div className={`pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full opacity-20 blur-2xl ${style.solid}`} />

                <h3 className="relative pr-20 font-display-mais text-2xl font-bold text-tinta-mais sm:pr-24">{journey.label}</h3>

                <p className="relative mt-2 pr-20 font-body-mais text-sm text-tinta-mais/75 sm:pr-24">{journey.description}</p>

              <div className="relative mt-4 rounded-2xl border-2 border-tinta-mais/10 bg-white px-4 py-3">
                <p className={`font-body-mais text-[13px] font-extrabold ${style.text}`}>Pergunta de abertura</p>
                <p className="mt-1 font-body-mais text-sm font-semibold italic text-tinta-mais">
                  &ldquo;{journey.openingQuestion}&rdquo;
                </p>
              </div>

              <div className="relative mt-4">
                <p className="font-body-mais text-[13px] font-extrabold text-tinta-mais/70">Capítulos</p>
                <ul className="mt-2 space-y-1.5">
                  {journey.chapters.map((chapter) => (
                    <li key={chapter} className="flex items-start gap-2 font-body-mais text-sm text-tinta-mais/85">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.solid}`} />
                      {chapter}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-5">
                <p className="font-body-mais text-[13px] font-extrabold text-tinta-mais/70">Sua evolução</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {(["day7", "day14", "day21"] as const).map((key, i) => (
                    <div key={key} className="flex flex-1 items-center gap-1.5">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white ${style.solid}`}>
                          {key === "day7" ? 7 : key === "day14" ? 14 : 21}
                        </span>
                      </div>
                      {i < 2 && <span className="h-[3px] flex-1 rounded-full bg-white" />}
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {(["day7", "day14", "day21"] as const).map((key) => (
                    <p key={key} className="font-body-mais text-[10.5px] leading-snug text-tinta-mais/65">
                      {journey.timeline[key]}
                    </p>
                  ))}
                </div>
              </div>

              {journeyTeas.length > 0 && (
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {journeyTeas.map((tea) => (
                    <Link
                      key={tea.slug}
                      href={`/produtos/${tea.slug}`}
                      className={`rounded-full border-2 bg-white px-3.5 py-1.5 font-body-mais text-xs font-bold ${style.chip}`}
                    >
                      {tea.name}
                    </Link>
                  ))}
                </div>
              )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
