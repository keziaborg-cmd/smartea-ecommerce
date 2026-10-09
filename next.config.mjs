// Mesmo padrão de lib/site.ts (aqui não dá pra importar TS).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://almara.com.br").replace(/\/+$/, "");

/** Caminhos renomeados no rebrand: os endereços antigos redirecionam (301) pros novos. */
const RENAMED_PATHS = [
  { from: "/smartea-mais", to: "/almara-mais" },
  { from: "/blog/autor/equipe-smartea", to: "/blog/autor/equipe-almara" },
  { from: "/flora.png", to: "/mara.png" },
  { from: "/flora-cha.png", to: "/mara-cha.png" },
];

const LEGACY_HOST = "(?:www\\.)?smartea\\.com\\.br";

/**
 * Domínio antigo → domínio novo, 301 com caminho e query. Só liga com REDIRECT_LEGACY_DOMAIN=1
 * (Vercel → Environment Variables), DEPOIS que o domínio novo estiver respondendo com HTTPS — ligado
 * antes, mandaria todo mundo pra um endereço fora do ar. O arquivo de verificação do Google fica de
 * fora: o Search Console precisa dele no domínio antigo durante a "Mudança de endereço".
 * Os caminhos renomeados vão direto pro endereço final (um salto só, não dois).
 *
 * @param {Record<string, string | undefined>} [env]
 */
export function legacyDomainRedirects(env = process.env) {
  if (env.REDIRECT_LEGACY_DOMAIN !== "1") return [];
  return [
    ...RENAMED_PATHS.map(({ from, to }) => ({
      source: from,
      has: [{ type: "host", value: LEGACY_HOST }],
      destination: `${SITE_URL}${to}`,
      statusCode: 301,
    })),
    {
      source: "/:path((?!google1e4100e11d0ac91d\\.html$).*)",
      has: [{ type: "host", value: LEGACY_HOST }],
      destination: `${SITE_URL}/:path`,
      statusCode: 301,
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      ...legacyDomainRedirects(),
      // A política antiga (/privacidade) foi substituída pela versão que também cobre o
      // aplicativo Almara+. O redirect mantém válidos os links já publicados — carrinho,
      // rodapé e qualquer URL indexada — apontando todos para o documento único.
      { source: "/privacidade", destination: "/politica-de-privacidade", permanent: true },
      // Rebrand Smartea → Almara: endereços antigos continuam funcionando com 301 (permanente),
      // o código que os buscadores tratam como mudança definitiva de URL.
      ...RENAMED_PATHS.map(({ from, to }) => ({ source: from, destination: to, statusCode: 301 })),
    ];
  },
};

export default nextConfig;
