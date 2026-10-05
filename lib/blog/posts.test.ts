import { describe, it, expect, vi } from "vitest";

// Fixtures ficam dentro do factory do mock (não em const externo) de propósito
// — vi.mock é hoisted pro topo do arquivo pelo Vitest, então uma referência a
// uma const declarada fora do factory quebraria com "cannot access before
// initialization".
vi.mock("node:fs", () => {
  const files: Record<string, string> = {
    "publicado.md": `---
title: Publicado de teste
slug: publicado-teste
category: sono
excerpt: Resumo de teste
author: equipe-smartea
date: "2026-01-01"
status: publicado
risk: baixo
sources: []
---
Corpo do artigo publicado, só pra teste.
`,
    "rascunho.md": `---
title: Rascunho de teste
slug: rascunho-teste
category: sono
excerpt: Resumo de teste
author: equipe-smartea
date: "2026-01-01"
status: rascunho
risk: baixo
sources: []
---
Corpo do artigo rascunho, nunca deveria aparecer publicamente.
`,
  };

  return {
    readdirSync: () => Object.keys(files),
    readFileSync: (path: string) => {
      const fileName = Object.keys(files).find((f) => String(path).endsWith(f));
      if (!fileName) throw new Error(`fixture não encontrada pra ${path}`);
      return files[fileName];
    },
  };
});

const { getPublishedPosts, getPublishedPostBySlug } = await import("./posts");

describe("getPublishedPosts", () => {
  it("nunca inclui um artigo com status rascunho", () => {
    const posts = getPublishedPosts();
    expect(posts.some((p) => p.slug === "rascunho-teste")).toBe(false);
  });

  it("inclui artigos com status publicado", () => {
    const posts = getPublishedPosts();
    expect(posts.some((p) => p.slug === "publicado-teste")).toBe(true);
  });
});

describe("getPublishedPostBySlug", () => {
  it("retorna undefined pra um slug de rascunho, mesmo sabendo o slug exato", () => {
    expect(getPublishedPostBySlug("rascunho-teste")).toBeUndefined();
  });

  it("retorna o artigo pra um slug publicado", () => {
    expect(getPublishedPostBySlug("publicado-teste")?.title).toBe("Publicado de teste");
  });
});
