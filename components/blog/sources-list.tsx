import type { PostSource } from "@/lib/blog/posts";

export function SourcesList({ sources }: { sources: PostSource[] }) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-10 border-t border-borda-clara pt-6">
      <p className="text-xs font-extrabold uppercase tracking-wide text-tinta/50">Fontes</p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {sources.map((source) => (
          <li key={source.url} className="text-sm">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-verde-folha hover:underline">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
