import { describe, it, expect, vi } from "vitest";

// Fixtures ficam dentro do factory do mock (não em const externo) de propósito
// — vi.mock é hoisted pro topo do arquivo pelo Vitest, então uma referência a
// uma const declarada fora do factory quebraria com "cannot access before
// initialization".
//
// O mock simula o que o Postgres real faz: a tabela tem um rascunho e um
// publicado, e só devolve linha quando o filtro pedido é .eq("status",
// "publicado") — exatamente a combinação que a policy de RLS real também
// aplica (ver supabase/migrations/20261006000000_blog_posts.sql). Se o
// código de lib/blog/posts.ts algum dia parar de filtrar por status
// explicitamente, este teste já pega isso, sem depender só da RLS.
vi.mock("@/lib/supabase/client", () => {
  const rows = [
    {
      title: "Publicado de teste",
      slug: "publicado-teste",
      category: "sono",
      excerpt: "Resumo de teste",
      author: "equipe-smartea",
      body_markdown: "Corpo do artigo publicado, só pra teste.",
      sources: [],
      risk: "baixo",
      status: "publicado",
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      title: "Rascunho de teste",
      slug: "rascunho-teste",
      category: "sono",
      excerpt: "Resumo de teste",
      author: "equipe-smartea",
      body_markdown: "Corpo do artigo em revisão, nunca deveria aparecer publicamente.",
      sources: [],
      risk: "baixo",
      status: "revisao",
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ];

  return {
    createClient: async () => ({
      from: () => ({
        select: () => ({
          eq: (col: string, val: string) => ({
            order: async () => ({
              data: rows.filter((r) => (r as Record<string, unknown>)[col] === val),
              error: null,
            }),
          }),
        }),
      }),
    }),
  };
});

const { getPublishedPosts, getPublishedPostBySlug } = await import("./posts");

describe("getPublishedPosts", () => {
  it("nunca inclui um artigo com status em revisão", async () => {
    const posts = await getPublishedPosts();
    expect(posts.some((p) => p.slug === "rascunho-teste")).toBe(false);
  });

  it("inclui artigos com status publicado", async () => {
    const posts = await getPublishedPosts();
    expect(posts.some((p) => p.slug === "publicado-teste")).toBe(true);
  });
});

describe("getPublishedPostBySlug", () => {
  it("retorna undefined pra um slug em revisão, mesmo sabendo o slug exato", async () => {
    expect(await getPublishedPostBySlug("rascunho-teste")).toBeUndefined();
  });

  it("retorna o artigo pra um slug publicado", async () => {
    const post = await getPublishedPostBySlug("publicado-teste");
    expect(post?.title).toBe("Publicado de teste");
  });
});
