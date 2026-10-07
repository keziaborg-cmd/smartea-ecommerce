"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/crm/tracker";

export function EmailCapture({ sourceSlug }: { sourceSlug: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.from("blog_subscribers").insert({ email, source_slug: sourceSlug });
    if (!error) track("newsletter_subscribed", { source: "blog", slug: sourceSlug }, { email });
    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <div className="rounded-card-conteudo border border-borda-clara bg-sucesso-bg p-6 text-center text-sm font-semibold text-sucesso-fg">
        Recebido! Avisamos por e-mail quando sair conteúdo novo.
      </div>
    );
  }

  return (
    <div className="rounded-card-conteudo border border-borda-clara bg-white p-6">
      <p className="font-display text-xl text-verde-escuro">Quer receber os próximos artigos?</p>
      <p className="mt-1 text-sm text-tinta/70">Sem spam — só avisos de conteúdo novo, de vez em quando.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className="w-full rounded-input border border-borda-clara-2 bg-input-bg px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-pill bg-verde-escuro px-6 py-3 text-sm font-bold text-creme disabled:opacity-60"
        >
          {status === "sending" ? "Enviando…" : "Quero receber"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600">Não deu certo. Tenta de novo em alguns minutos.</p>
      )}
    </div>
  );
}
