"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCartStore,
  selectCartLines,
  selectCartUnits,
  selectCartTier,
  selectSubtotalCents,
  selectShippingFeeCents,
  formatCentsBRL,
  type ShippingMethod,
} from "@/lib/cart/cart-store";
import { lookupCep } from "@/lib/cep/lookup";
import { PaymentBrick } from "@/components/checkout/payment-brick";
import { StepBadge } from "@/components/checkout/step-badge";
import { trackBeginCheckout } from "@/lib/tracking/events";

function Field({
  label,
  wide,
  ...inputProps
}: { label: string; wide?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-xs font-bold tracking-[.02em] text-[#4a5544]">{label}</label>
      <input
        {...inputProps}
        className="w-full rounded-input border border-borda-clara-2 bg-input-bg px-4 py-3 text-sm"
      />
    </div>
  );
}

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

const EMPTY_FORM: FormState = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

interface OrderDraft {
  orderNumber: string;
  accessToken: string;
  preferenceId: string;
  amount: number;
}

export default function CarrinhoPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const shippingMethod = useCartStore((s) => s.shippingMethod);
  const setShippingMethod = useCartStore((s) => s.setShippingMethod);

  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- see components/nav/nav.tsx
  useEffect(() => setHydrated(true), []);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const lines = hydrated ? selectCartLines(items) : [];
  const cartUnits = selectCartUnits(items);
  const cartTier = selectCartTier(items);
  const subtotalCents = selectSubtotalCents(items);
  const shippingFeeCents = selectShippingFeeCents(shippingMethod);
  const totalCents = subtotalCents + shippingFeeCents;

  const tierHint =
    cartTier === 1
      ? "Adicione mais 1 chá (qualquer sabor) e o preço de todas as unidades cai."
      : cartTier === 2
        ? "Adicione mais 1 chá (qualquer sabor) e desbloqueia o maior desconto."
        : "Você está no maior desconto — preço por unidade já é o menor da faixa.";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCepBlur() {
    const digits = form.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    const result = await lookupCep(form.cep);
    setCepLoading(false);
    if (!result) return;
    setForm((f) => ({
      ...f,
      rua: result.logradouro || f.rua,
      bairro: result.bairro || f.bairro,
      cidade: result.localidade || f.cidade,
      uf: result.uf || f.uf,
    }));
  }

  async function handleFinalizarCompra() {
    setError(null);
    if (!form.nome || !form.email || !form.telefone || !form.cep || !form.rua || !form.numero || !form.bairro || !form.cidade || !form.uf) {
      setError("Preencha todos os campos obrigatórios de entrega.");
      return;
    }
    if (!acceptedPrivacy) {
      setError("Você precisa aceitar a Política de Privacidade para finalizar a compra.");
      return;
    }

    setSubmitting(true);
    trackBeginCheckout({
      valueCents: totalCents,
      items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
    });

    try {
      const functionsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/shop-create-order`;
      const res = await fetch(functionsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        },
        body: JSON.stringify({
          customer: { nome: form.nome, email: form.email, telefone: form.telefone },
          shipping: {
            cep: form.cep,
            rua: form.rua,
            numero: form.numero,
            complemento: form.complemento,
            bairro: form.bairro,
            cidade: form.cidade,
            uf: form.uf,
            method: shippingMethod,
          },
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Não foi possível criar o pedido. Tente novamente.");
        setSubmitting(false);
        return;
      }
      setOrderDraft(data);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0 && !orderDraft) {
    return (
      <main className="animate-pagein px-[6vw] py-20 text-center">
        <p className="font-display text-2xl text-verde-escuro">Seu carrinho está vazio.</p>
        <Link href="/produtos" className="mt-4 inline-block font-semibold text-verde-folha hover:underline">
          Escolha um chá
        </Link>
      </main>
    );
  }

  return (
    <main className="animate-pagein px-[6vw] py-10">
      <div className="mx-auto max-w-[1200px] xl:max-w-[1360px] 2xl:max-w-[1560px]">
        <p className="eyebrow text-eyebrow-claro">Finalizar pedido</p>
        <h1 className="mt-2 font-display text-[clamp(38px,6vw,64px)] text-verde-escuro">Seu carrinho</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_.9fr]">
          <div className="flex flex-col gap-6">
            <section className="rounded-card-conteudo border border-borda-clara bg-white p-7">
              <div className="mb-5 flex items-center gap-3">
                <StepBadge n={1} />
                <h2 className="font-display text-xl text-verde-escuro">Dados de entrega</h2>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field wide label="Nome completo" placeholder="Seu nome" value={form.nome} onChange={(e) => updateField("nome", e.target.value)} />
                <Field wide label="E-mail" type="email" placeholder="voce@email.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                <Field label="Telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => updateField("telefone", e.target.value)} />
                <div>
                  <Field
                    label="CEP"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={(e) => updateField("cep", e.target.value)}
                    onBlur={handleCepBlur}
                  />
                  {cepLoading && <span className="mt-1.5 block text-xs text-eyebrow-claro">Buscando CEP…</span>}
                </div>
                <Field wide label="Endereço" placeholder="Rua / Avenida" value={form.rua} onChange={(e) => updateField("rua", e.target.value)} />
                <Field label="Número" placeholder="Nº" value={form.numero} onChange={(e) => updateField("numero", e.target.value)} />
                <Field label="Complemento" placeholder="Apto, bloco (opcional)" value={form.complemento} onChange={(e) => updateField("complemento", e.target.value)} />
                <Field wide label="Bairro" placeholder="Bairro" value={form.bairro} onChange={(e) => updateField("bairro", e.target.value)} />
                <Field label="Cidade" placeholder="Cidade" value={form.cidade} onChange={(e) => updateField("cidade", e.target.value)} />
                <Field label="UF" placeholder="UF" maxLength={2} value={form.uf} onChange={(e) => updateField("uf", e.target.value)} />
              </div>
            </section>

            <section className="rounded-card-conteudo border border-borda-clara bg-white p-7">
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n={2} />
                <h2 className="font-display text-xl text-verde-escuro">Método de envio</h2>
              </div>
              <div className="flex flex-col gap-3">
                {(
                  [
                    { value: "padrao" as ShippingMethod, label: "Entrega padrão", detail: "3–7 dias úteis", priceLabel: "R$ 12,90" },
                    { value: "retirada" as ShippingMethod, label: "Retirar na loja", detail: "Pronto em 24h", priceLabel: "Grátis" },
                  ]
                ).map((opt) => {
                  const selected = shippingMethod === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-input border-2 bg-input-bg px-[18px] py-[15px] ${
                        selected ? "border-verde-folha" : "border-borda-clara-2"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setShippingMethod(opt.value)}
                      />
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-verde-folha">
                        <span className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-verde-folha" : "bg-transparent"}`} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-extrabold text-verde-escuro">{opt.label}</span>
                        <span className="block text-xs text-eyebrow-claro">{opt.detail}</span>
                      </span>
                      <span className="text-[15px] font-extrabold text-verde-folha">{opt.priceLabel}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-card-conteudo border border-borda-clara bg-white p-7">
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n={3} />
                <h2 className="font-display text-xl text-verde-escuro">Pagamento</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Pix", "Cartão de crédito/débito", "Boleto"].map((chip) => (
                  <span key={chip} className="rounded-pill bg-sucesso-bg px-3.5 py-1.5 text-[13px] font-bold text-verde-folha">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                {orderDraft ? (
                  <PaymentBrick
                    orderNumber={orderDraft.orderNumber}
                    accessToken={orderDraft.accessToken}
                    amount={orderDraft.amount}
                    preferenceId={orderDraft.preferenceId}
                    payerEmail={form.email}
                    onApproved={() => {
                      useCartStore.getState().clear();
                      router.push(`/pedido/${orderDraft.orderNumber}?token=${orderDraft.accessToken}`);
                    }}
                    onError={(message) => setError(message)}
                  />
                ) : (
                  <div className="flex min-h-[230px] flex-col items-center justify-center rounded-input border border-dashed border-borda-clara-2 bg-input-bg p-6 text-center text-sm text-tinta/60">
                    Preencha os dados de entrega e clique em &ldquo;Finalizar compra&rdquo; para carregar o
                    pagamento (Payment Brick do Mercado Pago).
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-panel bg-verde-escuro p-7 lg:sticky lg:top-24">
            <div className="flex flex-col gap-4">
              {hydrated && cartUnits > 0 && (
                <div className="rounded-input bg-dourado/15 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-[.08em] text-dourado">
                    {cartTier === 1 ? "Preço avulso" : cartTier === 2 ? "Desconto de 2 unidades" : "Maior desconto ativo"}
                  </span>
                  <p className="mt-1 text-xs text-texto-sobre-escuro-2">{tierHint}</p>
                </div>
              )}
              {lines.map((line) => (
                <div key={line.slug} className="flex items-center justify-between gap-2 text-sm text-creme">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{line.name}</p>
                    <p className="text-texto-sobre-escuro-2">{formatCentsBRL(line.unitPriceCents)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button onClick={() => setQty(line.slug, line.qty - 1)} className="h-6 w-6 shrink-0 rounded-full bg-creme/15">
                      −
                    </button>
                    <span className="w-4 shrink-0 text-center">{line.qty}</span>
                    <button onClick={() => setQty(line.slug, line.qty + 1)} className="h-6 w-6 shrink-0 rounded-full bg-creme/15">
                      +
                    </button>
                  </div>
                  <span className="w-14 shrink-0 text-right">{formatCentsBRL(line.subtotalCents)}</span>
                  <button onClick={() => remove(line.slug)} aria-label={`Remover ${line.name}`} className="shrink-0 text-creme/50 hover:text-creme">
                    ✕
                  </button>
                </div>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-creme/15 pt-4 text-sm text-texto-sobre-escuro">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCentsBRL(subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>{formatCentsBRL(shippingFeeCents)}</span>
                </div>
                <div className="flex justify-between font-display text-xl text-creme">
                  <span>Total</span>
                  <span>{formatCentsBRL(totalCents)}</span>
                </div>
              </div>

              {!orderDraft && (
                <label className="mt-2 flex items-start gap-2.5 text-xs text-texto-sobre-escuro-2">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-dourado"
                  />
                  <span>
                    Li e aceito a{" "}
                    <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-dourado hover:underline">
                      Política de Privacidade
                    </Link>{" "}
                    e autorizo o uso dos meus dados para processar este pedido.
                  </span>
                </label>
              )}

              {error && <p className="text-sm text-red-300">{error}</p>}

              {!orderDraft && (
                <button
                  onClick={handleFinalizarCompra}
                  disabled={submitting || lines.length === 0}
                  className="mt-2 rounded-pill bg-dourado px-6 py-3.5 text-sm font-bold text-verde-escuro disabled:opacity-60"
                >
                  {submitting ? "Processando…" : `Finalizar compra · ${formatCentsBRL(totalCents)}`}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
