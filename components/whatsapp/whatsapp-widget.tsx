"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp/link";
import { isSupportOpen } from "@/lib/whatsapp/hours";

const TOPICS = [
  { label: "Tirar dúvida sobre um chá", message: "Olá! Vim pelo site da Almara e tenho uma dúvida sobre os chás." },
  { label: "Acompanhar meu pedido", message: "Olá! Queria saber sobre o andamento do meu pedido na Almara." },
  { label: "Ajuda para finalizar a compra", message: "Olá! Preciso de ajuda para finalizar minha compra na Almara." },
];

function subscribeMinute(cb: () => void) {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.89.9-3-.2-.31a8.2 8.2 0 1 1 6.88 3.75Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.28.18-.53.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.69c-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.36.99 2.52c.12.17 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

// Botão flutuante de WhatsApp. O clique no link vai pro WhatsApp da Almara e já é contado pelo
// CrmTracker (evento whatsapp_clicked, com a página de origem). Fica abaixo do banner de cookies
// (z-150) e do modal de contato (z-200).
export function WhatsAppWidget() {
  const pathname = usePathname();
  // Aberto só na rota em que foi aberto: trocar de página fecha o painel.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);
  // Depende da hora, então só existe no navegador (null no servidor: sem divergência de hidratação).
  const openNow = useSyncExternalStore(subscribeMinute, () => isSupportOpen(), () => null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          id="whatsapp-widget-panel"
          role="dialog"
          aria-label="Falar com a Almara no WhatsApp"
          className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-panel bg-white shadow-xl ring-1 ring-black/5"
        >
          <div className="flex items-start justify-between gap-3 bg-verde-escuro px-5 py-4 text-creme">
            <div>
              <p className="font-display text-xl leading-tight">Fale com a Almara</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-texto-sobre-escuro">
                <span
                  aria-hidden="true"
                  className={`inline-block h-2 w-2 rounded-full ${openNow ? "bg-whatsapp" : "bg-creme/40"}`}
                />
                {openNow === false
                  ? "Estamos fora do horário agora"
                  : "Respondemos em poucos minutos"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="-mr-1 -mt-1 rounded-full px-2 py-1 text-lg leading-none text-creme/80 hover:text-creme"
            >
              ×
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-tinta/80">
              {openNow === false
                ? "Deixe sua mensagem que respondemos no próximo dia útil, a partir das 8h. Atendemos de segunda a sexta, das 8h às 18h."
                : "Tem alguma dúvida sobre os chás, o pedido ou a compra? Escolha um assunto e continue a conversa direto no nosso WhatsApp."}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {TOPICS.map((t) => (
                <a
                  key={t.label}
                  href={buildWhatsAppLink(t.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-input border border-borda-clara-2 px-4 py-2.5 text-sm font-semibold text-verde-escuro hover:border-dourado"
                >
                  {t.label}
                </a>
              ))}
            </div>
            <a
              href={buildWhatsAppLink("Olá! Vim pelo site da Almara e queria falar com vocês.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-whatsapp px-6 py-3 text-sm font-bold text-whatsapp-fg"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Iniciar conversa
            </a>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="whatsapp-widget-panel"
        aria-label={open ? "Fechar conversa no WhatsApp" : "Falar com a Almara no WhatsApp"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-fg shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
