/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // A política antiga (/privacidade) foi substituída pela versão que também cobre o
      // aplicativo Smartea+. O redirect mantém válidos os links já publicados — carrinho,
      // rodapé e qualquer URL indexada — apontando todos para o documento único.
      { source: "/privacidade", destination: "/politica-de-privacidade", permanent: true },
    ];
  },
};

export default nextConfig;
