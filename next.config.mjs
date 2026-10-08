/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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
