"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConsentStore } from "@/lib/consent/consent";
import { track } from "@/lib/crm/tracker";

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start gap-3 rounded-input border border-white/15 bg-white/5 px-4 py-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-dourado"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-semibold text-creme">{label}</span>
        <span className="block text-xs text-texto-sobre-escuro/80">{description}</span>
      </span>
    </label>
  );
}

// Montado de novo a cada abertura, então sempre começa da escolha atual (ou tudo desligado).
function PreferencesForm({
  initial,
  canCancel,
  onCancel,
  onSave,
}: {
  initial: { analytics: boolean; marketing: boolean } | null;
  canCancel: boolean;
  onCancel: () => void;
  onSave: (c: { analytics: boolean; marketing: boolean }) => void;
}) {
  const [analytics, setAnalytics] = useState(initial?.analytics ?? false);
  const [marketing, setMarketing] = useState(initial?.marketing ?? false);

  return (
    <>
      <div className="mt-4 flex flex-col gap-2.5">
        <Toggle label="Essenciais" description="Carrinho, checkout e segurança. Sempre ativos." checked disabled />
        <Toggle
          label="Análise"
          description="Páginas visitadas e cliques, para melhorar o site e o atendimento."
          checked={analytics}
          onChange={setAnalytics}
        />
        <Toggle
          label="Marketing"
          description="Medição e personalização de anúncios (ex.: Meta)."
          checked={marketing}
          onChange={setMarketing}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-pill border border-white/30 px-6 py-3 text-sm font-semibold text-creme hover:border-dourado"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={() => onSave({ analytics, marketing })}
          className="rounded-pill bg-creme px-7 py-3 text-sm font-semibold text-verde-escuro"
        >
          Salvar escolhas
        </button>
      </div>
    </>
  );
}

export function CookieBanner() {
  const { choice, loaded, panelOpen, load, decide, closePanel } = useConsentStore();
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded || (choice && !panelOpen)) return null;

  function save(next: { analytics: boolean; marketing: boolean }) {
    decide(next);
    setCustomizing(false);
    track("cookie_consent_updated", next);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[150] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-h-[calc(100vh-2rem)] max-w-[760px] overflow-y-auto rounded-panel bg-verde-escuro p-6 sm:p-7">
        <p id="cookie-banner-title" className="font-display text-2xl text-creme">
          Cookies na Almara
        </p>
        <p className="mt-2 text-sm leading-relaxed text-texto-sobre-escuro">
          Usamos cookies essenciais para o site funcionar. Com a sua permissão, também usamos cookies de análise, para
          entender como o site é usado e melhorar sua experiência, e de marketing, para medir e personalizar anúncios.
          Você pode mudar sua escolha quando quiser em “Preferências de cookies”, no rodapé. Saiba mais na{" "}
          <Link href="/politica-de-privacidade" className="font-semibold text-dourado underline">
            Política de Privacidade
          </Link>
          .
        </p>

        {customizing || panelOpen ? (
          <PreferencesForm
            initial={choice}
            canCancel={Boolean(choice)}
            onCancel={() => {
              closePanel();
              setCustomizing(false);
            }}
            onSave={save}
          />
        ) : (
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="rounded-pill px-6 py-3 text-sm font-semibold text-texto-sobre-escuro underline hover:text-creme"
            >
              Personalizar
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              className="rounded-pill border border-white/30 px-6 py-3 text-sm font-semibold text-creme hover:border-dourado"
            >
              Só essenciais
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
              className="rounded-pill bg-creme px-7 py-3 text-sm font-semibold text-verde-escuro"
            >
              Aceitar todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
