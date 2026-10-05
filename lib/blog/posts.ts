import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { isBlogCategory, type BlogCategory } from "@/data/blog-categories";

const CONTENT_DIR = join(process.cwd(), "content", "blog");

export type PostStatus = "publicado" | "rascunho";
export type PostRisk = "alto" | "baixo";

export interface PostSource {
  title: string;
  url: string;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  author: string;
  date: string;
  status: PostStatus;
  risk: PostRisk;
  sources: PostSource[];
}

export interface BlogPost extends BlogPostFrontmatter {
  /** HTML já renderizado a partir do corpo em Markdown do arquivo. */
  contentHtml: string;
  /** Estimativa simples (palavras / 200wpm), arredondada pra cima, mínimo 1. */
  readingTimeMinutes: number;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function parseFrontmatter(raw: Record<string, unknown>, fileName: string): BlogPostFrontmatter {
  const category = String(raw.category ?? "");
  if (!isBlogCategory(category)) {
    throw new Error(`${fileName}: categoria inválida "${category}".`);
  }
  const status = raw.status === "publicado" ? "publicado" : "rascunho";
  const risk = raw.risk === "alto" ? "alto" : "baixo";

  return {
    title: String(raw.title ?? ""),
    slug: String(raw.slug ?? fileName.replace(/\.md$/, "")),
    category,
    excerpt: String(raw.excerpt ?? ""),
    author: String(raw.author ?? "equipe-smartea"),
    date: String(raw.date ?? ""),
    status,
    risk,
    sources: Array.isArray(raw.sources)
      ? raw.sources.map((s) => ({ title: String((s as PostSource).title ?? ""), url: String((s as PostSource).url ?? "") }))
      : [],
  };
}

function loadAllPostsUnfiltered(): BlogPost[] {
  let fileNames: string[];
  try {
    fileNames = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    // Pasta ainda não existe (ex.: antes do primeiro artigo ser adicionado) — lista vazia, não erro.
    return [];
  }

  return fileNames.map((fileName) => {
    const raw = readFileSync(join(CONTENT_DIR, fileName), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = parseFrontmatter(data, fileName);
    return {
      ...frontmatter,
      contentHtml: marked.parse(content, { async: false }) as string,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount(content) / 200)),
    };
  });
}

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Só artigos com status "publicado" — é o único portão que as páginas
 * públicas, a listagem e o sitemap enxergam. Um rascunho nunca passa daqui. */
export function getPublishedPosts(): BlogPost[] {
  return sortByDateDesc(loadAllPostsUnfiltered().filter((p) => p.status === "publicado"));
}

export function getPublishedPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

export function getPublishedPostsByCategory(category: BlogCategory): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getPublishedPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, limit);
}

export function getPublishedPostsByAuthor(authorSlug: string): BlogPost[] {
  return getPublishedPosts().filter((p) => p.author === authorSlug);
}
