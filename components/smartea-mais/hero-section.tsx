import Image from "next/image";
import { PillButton3D } from "@/components/smartea-mais/pill-button-3d";
import { AchievementBadge } from "@/components/smartea-mais/achievement-badge";
import { ACHIEVEMENTS } from "@/data/smartea-mais-content";

const BADGE_COLORS = ["verde", "sono", "ansiedade", "produtividade"] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-panel bg-folha-viva-clara px-[6vw] py-14 md:py-20">
      <div className="mx-auto grid max-w-[1160px] items-center gap-12 md:grid-cols-[1.15fr_0.85fr] xl:max-w-[1320px] 2xl:max-w-[1500px]">
        <div className="text-center md:text-left">
          <span className="inline-block rounded-full bg-white px-4 py-1.5 font-body-mais text-xs font-extrabold uppercase tracking-wide text-folha-viva-escura">
            Almara+
          </span>
          <h1 className="mt-4 font-display-mais text-[clamp(36px,5.4vw,58px)] font-bold leading-[1.05] text-tinta-mais">
            Um app de bem-estar mental guiado por jornadas de chá
          </h1>
          <p className="mx-auto mt-5 max-w-md font-body-mais text-tinta-mais/75 md:mx-0">
            O Almara+ é o app que acompanha o seu chá: jornadas guiadas de 21 dias, hábitos e um
            jardim que cresce com você.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
            <PillButton3D href="/quiz" variant="primary">
              Descobrir minha jornada
            </PillButton3D>
            <PillButton3D href="/produtos" variant="white">
              Ver os chás
            </PillButton3D>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-5 md:justify-start">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge key={a.label} value={a.value} label={a.label} color={BADGE_COLORS[i]} />
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[320px] justify-center">
          <div className="relative">
            <div className="absolute -right-20 top-16 z-10 w-[150px] rounded-2xl border-2 border-tinta-mais/10 bg-white px-3.5 py-2.5 font-body-mais text-sm font-extrabold text-tinta-mais shadow-md">
              Oi, eu sou a Mara!
              <span className="absolute -left-[7px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-tinta-mais/10 bg-white" />
            </div>
            <Image
              src="/flora.png"
              alt="Mara, mascote do Almara+"
              width={3375}
              height={4219}
              priority
              className="animate-floaty relative z-0 h-[260px] w-auto drop-shadow-xl sm:h-[300px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
