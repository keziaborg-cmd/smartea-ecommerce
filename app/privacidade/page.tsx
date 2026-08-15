import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Smartea",
  description: "Como a Smartea coleta, usa e protege seus dados pessoais.",
};

const SECTIONS = [
  {
    title: "1. Quem somos",
    body: [
      "A Smartea é a controladora dos dados pessoais tratados neste site, nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD). Para qualquer dúvida ou solicitação relacionada aos seus dados, entre em contato pelo e-mail ola@smartea.com.",
    ],
  },
  {
    title: "2. Quais dados coletamos",
    body: [
      "Ao fazer um pedido, coletamos: nome completo, e-mail, telefone e endereço de entrega (CEP, rua, número, complemento, bairro, cidade e UF).",
      "Não coletamos nem armazenamos dados de cartão de crédito, chave Pix ou qualquer outro dado sensível de pagamento. Esses dados são inseridos diretamente na plataforma do Mercado Pago, nosso processador de pagamentos, e trafegam por infraestrutura própria dele — a Smartea não tem acesso a eles.",
      "Também coletamos, de forma anônima, as respostas do quiz de recomendação de chás e dados de navegação (páginas visitadas, produtos visualizados) por meio de cookies de análise e publicidade.",
    ],
  },
  {
    title: "3. Para que usamos seus dados",
    body: [
      "Processar e entregar seu pedido, incluindo comunicação sobre status de pagamento e envio.",
      "Responder a contatos enviados por e-mail ou WhatsApp.",
      "Melhorar o site e as recomendações do quiz, de forma agregada e anônima.",
      "Cumprir obrigações legais e fiscais relacionadas à venda de produtos.",
      "Com o seu consentimento, medir a performance de campanhas de marketing (Google Analytics e Meta Pixel).",
    ],
  },
  {
    title: "4. Com quem compartilhamos",
    body: [
      "Mercado Pago — processamento do pagamento (Pix, cartão ou boleto). Os dados de pagamento em si nunca passam pelos nossos servidores.",
      "Transportadora responsável pela entrega — recebe apenas os dados de endereço necessários para a entrega.",
      "Google Analytics e Meta (Facebook/Instagram) — dados de navegação anonimizados, usados para métricas de audiência e campanhas.",
      "Não vendemos nem alugamos seus dados pessoais a terceiros.",
    ],
  },
  {
    title: "5. Por quanto tempo guardamos seus dados",
    body: [
      "Dados de pedidos são mantidos pelo prazo exigido pela legislação fiscal e de defesa do consumidor (geralmente 5 anos). Dados de contato de quem não finalizou uma compra são mantidos por até 12 meses, podendo ser excluídos antes mediante solicitação.",
    ],
  },
  {
    title: "6. Seus direitos",
    body: [
      "Nos termos da LGPD, você pode solicitar a qualquer momento: confirmação de que tratamos seus dados, acesso aos dados, correção de dados incompletos ou desatualizados, anonimização ou exclusão de dados desnecessários, portabilidade dos dados, informação sobre com quem compartilhamos seus dados, e revogação do consentimento dado.",
      "Para exercer qualquer um desses direitos, escreva para ola@smartea.com. Respondemos em até 15 dias.",
    ],
  },
  {
    title: "7. Cookies",
    body: [
      "Usamos cookies essenciais (para o carrinho de compras funcionar) e cookies de análise/publicidade (Google Analytics, Meta Pixel), que só são ativados com o seu consentimento ou conforme as configurações do seu navegador.",
    ],
  },
  {
    title: "8. Segurança",
    body: [
      "Adotamos medidas técnicas razoáveis para proteger seus dados contra acesso não autorizado, incluindo conexão criptografada (HTTPS) em todo o site e acesso restrito aos sistemas internos que armazenam dados de pedidos.",
    ],
  },
  {
    title: "9. Alterações a esta política",
    body: [
      "Esta política pode ser atualizada periodicamente. A data da última atualização é indicada no topo desta página. Alterações relevantes serão comunicadas de forma visível no site.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <main className="animate-pagein px-[6vw] py-14">
      <div className="mx-auto max-w-[760px]">
        <p className="eyebrow text-eyebrow-claro">Legal</p>
        <h1 className="mt-3 font-display text-[clamp(38px,6vw,56px)] text-verde-escuro">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-sm text-tinta/60">Última atualização: 13 de agosto de 2026.</p>

        <p className="mt-8 leading-relaxed text-tinta/80">
          Esta política explica como a Smartea coleta, usa, compartilha e protege seus dados pessoais
          quando você visita este site ou faz uma compra, em conformidade com a Lei Geral de Proteção
          de Dados Pessoais (LGPD).
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl text-verde-escuro">{section.title}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-tinta/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
