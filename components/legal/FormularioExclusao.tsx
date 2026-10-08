"use client";

/**
 * Formulário de solicitação de exclusão de conta pela web.
 *
 * Por que `mailto:` e não um POST para uma API:
 *
 * A exigência é que só o titular consiga pedir a exclusão. Um formulário que envia um endereço
 * digitado não prova nada — qualquer pessoa digitaria o e-mail de outra. Fazendo o pedido sair do
 * cliente de e-mail da própria pessoa, a mensagem chega necessariamente de uma caixa que ela
 * controla, e o atendimento ainda responde pedindo confirmação antes de executar. O site também
 * não tem provedor de envio de e-mail configurado, então um POST hoje só criaria um registro que
 * ninguém leria.
 *
 * O caminho imediato e sem espera continua sendo o app: Perfil → Excluir conta.
 */

import { useMemo, useState } from "react";

const DESTINO = "ola@almara.com.br";
const ASSUNTO = "Excluir conta";
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Endereço e assunto como texto selecionável, com botão de copiar.
 *
 * `mailto:` falha silenciosamente em desktop sem cliente de e-mail configurado — o clique não faz
 * nada e a pessoa fica sem saída. Estes dois campos são o caminho alternativo, e funcionam também
 * pra quem usa webmail.
 */
function CampoCopiavel({ rotulo, valor }: { rotulo: string; valor: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor);
    } catch {
      // navegador sem permissão de área de transferência (ou contexto não seguro):
      // seleciona o texto pra pessoa copiar com o teclado
      const alvo = document.getElementById(`copiavel-${rotulo}`);
      if (alvo) {
        const faixa = document.createRange();
        faixa.selectNodeContents(alvo);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(faixa);
      }
      return;
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="w-16 shrink-0 text-sm text-tinta/55">{rotulo}</span>
      <code
        id={`copiavel-${rotulo}`}
        className="select-all break-all rounded-lg bg-verde-escuro/[0.06] px-2.5 py-1 font-mono text-sm text-verde-escuro"
      >
        {valor}
      </code>
      <button
        type="button"
        onClick={copiar}
        className="rounded-full border border-verde-escuro/25 px-3 py-1 text-xs font-medium text-verde-escuro transition hover:bg-verde-escuro/[0.06]"
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export function FormularioExclusao() {
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [ciente, setCiente] = useState(false);

  const emailOk = EMAIL_VALIDO.test(email.trim());
  const pronto = emailOk && ciente;

  const href = useMemo(() => {
    const corpo = [
      "Solicito a exclusão da minha conta Almara+ e dos dados associados a ela.",
      "",
      `E-mail cadastrado na conta: ${email.trim()}`,
      motivo.trim() ? `Motivo: ${motivo.trim()}` : "Motivo: (não informado)",
      "",
      "Estou ciente de que a exclusão é permanente e não pode ser desfeita.",
    ].join("\n");
    return `mailto:${DESTINO}?subject=${encodeURIComponent(ASSUNTO)}&body=${encodeURIComponent(corpo)}`;
  }, [email, motivo]);

  return (
    <form
      className="mt-8 rounded-2xl border border-verde-escuro/15 bg-verde-escuro/[0.03] p-5 sm:p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="exclusao-email" className="text-sm font-medium text-verde-escuro">
            E-mail cadastrado na conta <span className="text-tinta/50">(obrigatório)</span>
          </label>
          <input
            id="exclusao-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className="w-full rounded-xl border border-verde-escuro/20 bg-white px-4 py-3 text-tinta outline-none placeholder:text-tinta/35 focus:border-verde-escuro/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="exclusao-motivo" className="text-sm font-medium text-verde-escuro">
            Motivo <span className="text-tinta/50">(opcional)</span>
          </label>
          <textarea
            id="exclusao-motivo"
            name="motivo"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full resize-y rounded-xl border border-verde-escuro/20 bg-white px-4 py-3 text-tinta outline-none placeholder:text-tinta/35 focus:border-verde-escuro/50"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-tinta/80">
          <input
            type="checkbox"
            checked={ciente}
            onChange={(e) => setCiente(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-verde-escuro"
          />
          <span>Entendo que a exclusão é permanente e não pode ser desfeita.</span>
        </label>

        {pronto ? (
          <a
            href={href}
            className="inline-flex w-full items-center justify-center rounded-full bg-verde-escuro px-6 py-3 font-medium text-white transition hover:opacity-90 sm:w-auto"
          >
            Enviar solicitação
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-verde-escuro/30 px-6 py-3 font-medium text-white sm:w-auto"
          >
            Enviar solicitação
          </button>
        )}

        <p className="text-sm leading-relaxed text-tinta/60">
          O botão abre seu programa de e-mail com a mensagem já escrita. O pedido precisa partir do
          endereço cadastrado — é assim que confirmamos que só o titular consegue solicitar a exclusão.
        </p>

        <div className="rounded-xl border border-verde-escuro/15 bg-white/60 p-4">
          <p className="text-sm leading-relaxed text-tinta/70">
            Nem todo computador tem um programa de e-mail configurado. Se o botão não abrir nada, envie
            a mensagem pelo seu webmail com estes dados:
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <CampoCopiavel rotulo="Para" valor={DESTINO} />
            <CampoCopiavel rotulo="Assunto" valor={ASSUNTO} />
          </div>
        </div>
      </div>
    </form>
  );
}
