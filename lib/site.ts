/**
 * Endereço público do site, num lugar só: metadataBase, canonical, sitemap, robots, JSON-LD e a
 * imagem de compartilhamento leem daqui. Vem de NEXT_PUBLIC_SITE_URL (Vercel → Environment
 * Variables); o padrão é o domínio definitivo. Sem barra no fim.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://almara.com.br").replace(/\/+$/, "");

/** Só o domínio (ex.: almara.com.br), pra exibir. */
export const SITE_HOST = new URL(SITE_URL).host;
