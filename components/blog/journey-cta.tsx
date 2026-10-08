import Link from "next/link";
import { getJourneyBySlug } from "@/data/journeys";
import { BLOG_CATEGORY_TO_JOURNEY_SLUG, type BlogCategory } from "@/data/blog-categories";

export function JourneyCta({ category }: { category: BlogCategory }) {
  const journey = getJourneyBySlug(BLOG_CATEGORY_TO_JOURNEY_SLUG[category]);
  if (!journey) return null;

  return (
    <div className="mt-10 rounded-panel bg-verde-escuro p-8 text-center">
      <p className="eyebrow text-dourado">No Almara+</p>
      <p className="mt-2 font-display text-2xl text-creme">Jornada {journey.label}, 21 dias com a Mara</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-texto-sobre-escuro">{journey.description}</p>
      <Link
        href="/smartea-mais"
        className="mt-5 inline-block rounded-pill bg-dourado px-7 py-3 text-sm font-bold text-verde-escuro"
      >
        Conhecer o Almara+
      </Link>
    </div>
  );
}
