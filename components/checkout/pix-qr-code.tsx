"use client";

import { useEffect, useState } from "react";
import type { PixPending } from "@/components/checkout/payment-brick";

const POLL_INTERVAL_MS = 5000;

// shop_orders.status só admite estes 4 valores (check constraint no banco +
// mapMpStatusToOrderStatus, que já colapsa "refunded"/"charged_back" da MP
// em "cancelled" antes de chegar aqui) — não existe "expired" nem "refunded"
// como status próprio; expiração é tratada à parte, por tempo (date_of_expiration).
type OrderStatus = "pending" | "approved" | "rejected" | "cancelled";

type PixOutcome = "pending" | "expired" | "rejected" | "cancelled";

const FAILURE_COPY: Record<"rejected" | "cancelled", { title: string; message: string }> = {
  rejected: {
    title: "Pagamento recusado",
    message: "O Mercado Pago recusou este pagamento. Tente novamente ou escolha outro método.",
  },
  cancelled: {
    title: "Pagamento cancelado",
    message: "Este Pix foi cancelado ou não foi recebido a tempo. Gere um novo código e tente de novo.",
  },
};

function isExpired(expiresAt: string | null): boolean {
  return expiresAt !== null && new Date(expiresAt).getTime() <= Date.now();
}

interface PixQrCodeProps extends PixPending {
  orderNumber: string;
  accessToken: string;
  onConfirmed: () => void;
  /** Volta pra escolha de método de pagamento (expiração ou falha) — os dados de entrega já preenchidos não são afetados. */
  onRetry: () => void;
}

function FailureBox({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-input border border-dashed border-borda-clara-2 bg-input-bg p-6 text-center">
      <p className="text-sm font-bold text-tinta">{title}</p>
      <p className="text-sm text-tinta/70">{message}</p>
      <button onClick={onRetry} className="rounded-pill bg-verde-escuro px-6 py-2.5 text-sm font-semibold text-creme">
        Tentar novamente
      </button>
    </div>
  );
}

export function PixQrCode({ qrCode, qrCodeBase64, expiresAt, orderNumber, accessToken, onConfirmed, onRetry }: PixQrCodeProps) {
  const [copied, setCopied] = useState(false);
  const [outcome, setOutcome] = useState<PixOutcome>(() => (isExpired(expiresAt) ? "expired" : "pending"));

  // Consulta o status do pedido a cada alguns segundos enquanto a tela do
  // QR estiver aberta — o webhook do Mercado Pago já atualiza o status no
  // banco assim que o pagamento muda de estado; aqui só lemos esse status,
  // sem reimplementar a confirmação. Some status (aprovado, recusado,
  // cancelado) encerram o polling; "pending" é o único que continua tentando.
  useEffect(() => {
    if (outcome !== "pending") return;

    let cancelled = false;

    async function checkStatus() {
      try {
        const functionsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/shop-get-order`;
        const res = await fetch(functionsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
          },
          body: JSON.stringify({ orderNumber, accessToken }),
        });
        if (!res.ok || cancelled) return;
        const data: { status: OrderStatus } = await res.json();
        if (cancelled) return;
        if (data.status === "approved") {
          onConfirmed();
        } else if (data.status === "rejected" || data.status === "cancelled") {
          setOutcome(data.status);
        }
      } catch {
        // falha pontual de rede — a próxima rodada do polling tenta de novo
      }
    }

    checkStatus();
    const interval = setInterval(() => {
      if (isExpired(expiresAt)) {
        setOutcome("expired");
        return;
      }
      checkStatus();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderNumber, accessToken, expiresAt, outcome, onConfirmed]);

  async function handleCopy() {
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (outcome === "expired") {
    return (
      <FailureBox
        title="Código Pix expirado"
        message="O prazo pra pagar esse QR Code passou. Gere um novo código e tente de novo."
        onRetry={onRetry}
      />
    );
  }

  if (outcome === "rejected" || outcome === "cancelled") {
    return <FailureBox title={FAILURE_COPY[outcome].title} message={FAILURE_COPY[outcome].message} onRetry={onRetry} />;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-input border border-borda-clara-2 bg-input-bg p-6 text-center">
      <p className="text-sm font-bold text-tinta">Escaneie o QR Code ou copie o código Pix</p>

      {qrCodeBase64 && (
        // eslint-disable-next-line @next/next/no-img-element -- imagem gerada em base64, não faz sentido pelo otimizador de imagens do Next
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code para pagamento via Pix"
          className="h-52 w-52 rounded-lg border border-borda-clara-2 bg-white p-2"
        />
      )}

      <button
        onClick={handleCopy}
        className="rounded-pill bg-verde-escuro px-6 py-2.5 text-sm font-semibold text-creme"
      >
        {copied ? "Código copiado!" : "Copiar código"}
      </button>

      <p className="max-w-xs text-xs text-tinta/60">
        Abra o app do seu banco, escolha pagar com Pix e escaneie o QR Code acima ou cole o código copiado.
      </p>

      <p className="flex items-center gap-2 text-xs text-tinta/50">
        <span className="h-2 w-2 animate-pulse rounded-full bg-verde-folha" aria-hidden />
        Aguardando confirmação do pagamento…
      </p>
    </div>
  );
}
