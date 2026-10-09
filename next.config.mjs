// Mesmo padrão de lib/site.ts (aqui não dá pra importar TS).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://almara.com.br").replace(/\/+$/, "");

/**
 * Domínio antigo → domínio novo, 301 com caminho e query. Só liga com REDIRECT_LEGACY_DOMAIN=1
 * (Vercel → Environment Variables), DEPOIS que o domínio novo estiver respondendo com HTTPS — ligado
 * antes, mandaria todo mundo pra um endereço fora do ar. O arquivo de verificação do Google fica de
 * fora: o Search Console precisa dele no domínio antigo durante a "Mudança de endereço".
 *
 * @param {Record<string, string | undefined>} [env]
 */
export function legacyDomainRedirects(env = process.env) {
  if (env.REDIRECT_LEGACY_DOMAIN !== "1") return [];
  return [
    {
      source: "/:path((?!google1e4100e11d0ac91d\\.html$).*)",
      has: [{ type: "host", value: "(?:www\\.)?smartea\\.com\\.br" }],
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
      { source: "/smartea-mais", destination: "/almara-mais", statusCode: 301 },
      { source: "/blog/autor/equipe-smartea", destination: "/blog/autor/equipe-almara", statusCode: 301 },
      { source: "/flora.png", destination: "/mara.png", statusCode: 301 },
      { source: "/flora-cha.png", destination: "/mara-cha.png", statusCode: 301 },
    ];
  },
};

export default nextConfig;
