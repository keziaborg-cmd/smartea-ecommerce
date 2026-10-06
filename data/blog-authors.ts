// Autores do blog — hoje só a Smartea como autora institucional, mas a
// estrutura já aceita profissionais parceiros assinando artigos no futuro
// (bio, credencial, foto por autor, não só um nome solto no frontmatter).
export interface BlogAuthor {
  slug: string;
  name: string;
  /** Credencial/cargo, ex.: "Nutricionista, CRN 12345" — opcional pra autoria institucional. */
  credential?: string;
  bio: string;
  photo?: string;
}

export const BLOG_AUTHORS: BlogAuthor[] = [
  {
    slug: "equipe-smartea",
    name: "Equipe Smartea",
    bio: "Conteúdo escrito pela equipe editorial da Smartea, com apoio de fontes públicas confiáveis — sempre citadas ao final de cada artigo.",
  },
];

export function getBlogAuthorBySlug(slug: string): BlogAuthor | undefined {
  return BLOG_AUTHORS.find((a) => a.slug === slug);
}
