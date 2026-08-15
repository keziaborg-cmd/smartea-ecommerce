"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

// Per the official usage pattern (@mercadopago/sdk-react README): call
// initMercadoPago once at module scope, not inside a component effect.
// ES modules only evaluate top-level code once per load, so this still runs
// exactly once — but *before* <Payment> ever mounts, instead of racing it.
// Guarded by `typeof window` because Next.js still executes "use client"
// modules once server-side for the initial SSR pass, where there's no
// window for the SDK's own script injection to attach to.
const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
if (typeof window !== "undefined" && publicKey) {
  initMercadoPago(publicKey, { locale: "pt-BR" });
}

interface PaymentBrickProps {
  orderNumber: string;
  accessToken: string;
  amount: number;
  preferenceId: string;
  payerEmail: string;
  onApproved: () => void;
  onError: (message: string) => void;
}

export function PaymentBrick({
  orderNumber,
  accessToken,
  amount,
  preferenceId,
  payerEmail,
  onApproved,
  onError,
}: PaymentBrickProps) {
  if (!publicKey) {
    return (
      <div className="flex min-h-[230px] items-center justify-center rounded-input border border-dashed border-borda-clara-2 bg-input-bg text-sm text-tinta/60">
        Payment Brick não configurado: falta NEXT_PUBLIC_MP_PUBLIC_KEY.
      </div>
    );
  }

  return (
    <Payment
      initialization={{
        amount,
        preferenceId,
        payer: { email: payerEmail },
      }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
          bankTransfer: "all",
        },
      }}
      onSubmit={async ({ formData }) => {
        const functionsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/shop-process-payment`;
        const res = await fetch(functionsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
          },
          body: JSON.stringify({ orderNumber, accessToken, formData }),
        });
        const data = await res.json();
        if (!res.ok || data.status === "rejected") {
          onError(data.message ?? "Pagamento não aprovado. Tente novamente.");
          return;
        }
        onApproved();
      }}
      onError={(error) => {
        console.error("Payment Brick error", error);
        onError("Não foi possível carregar o formulário de pagamento.");
      }}
    />
  );
}
