import { describe, it, expect, vi } from "vitest";
import type { BlogPost } from "@/lib/blog/posts";

const FAKE_PUBLISHED_POST = {
  title: "Publicado",
  slug: "publicado-teste",
  category: "sono",
  excerpt: "",
  author: "equipe-almara",
  date: "2026-01-01",
  status: "publicado",
  risk: "baixo",
  sources: [],
  contentHtml: "",
  readingTimeMinutes: 1,
} satisfies BlogPost;

// getPublishedPosts() já garante, na própria origem, que rascunho nunca sai
// daqui (ver lib/blog/posts.test.ts) — este teste confirma que o sitemap só
// usa essa função como fonte, sem adicionar nenhuma URL de artigo por fora
// dela (o que poderia reintroduzir um rascunho por acidente).
vi.mock("@/lib/blog/posts", () => ({
  getPublishedPosts: async () => [FAKE_PUBLISHED_POST],
}));

const { default: sitemap } = await import("./sitemap");

describe("sitemap", () => {
  it("inclui a URL do artigo publicado", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://almara.com.br/blog/publicado-teste");
  });

  it("não inclui nenhuma URL de blog além das que vêm de getPublishedPosts", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    const blogPostUrls = urls.filter((url) => url.startsWith("https://almara.com.br/blog/") && !url.includes("/autor/"));
    expect(blogPostUrls).toEqual(["https://almara.com.br/blog/publicado-teste"]);
  });
});
