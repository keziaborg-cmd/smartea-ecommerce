import Link from "next/link";
import { CategoryBadge } from "@/components/blog/category-badge";
import type { BlogPost } from "@/lib/blog/posts";

function formatDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col gap-3 rounded-card-conteudo border border-borda-clara bg-white p-6 transition hover:border-verde-folha"
    >
      <CategoryBadge category={post.category} />
      <h3 className="font-display text-xl text-verde-escuro">{post.title}</h3>
      <p className="line-clamp-3 text-sm text-tinta/70">{post.excerpt}</p>
      <p className="mt-auto text-xs text-tinta/50">
        {formatDate(post.date)} · {post.readingTimeMinutes} min de leitura
      </p>
    </Link>
  );
}
