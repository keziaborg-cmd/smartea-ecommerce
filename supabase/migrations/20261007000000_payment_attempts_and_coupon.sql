-- Histórico de pagamento e cupom no pedido (base pro CRM — Recovery depende disso).
--
-- Antes: cada notificação do Mercado Pago sobrescrevia shop_orders.status, sem guardar o motivo
-- da recusa e guardando só o último mp_payment_id. Isso tornava impossível ver "recusado ->
-- tentou de novo -> aprovado". Agora cada pagamento criado no Mercado Pago vira uma linha aqui, e
-- o status do pedido continua sendo o resumo (o último estado).

alter table public.shop_orders add column if not exists coupon_code text;
alter table public.shop_orders add column if not exists mp_status_detail text;

-- Trava da "primeira aprovação": quem conseguir preencher (update ... where confirmed_at is null)
-- é o único que envia o e-mail de confirmação e registra order_confirmed. Antes isso dependia da
-- transição de status, e quando o cartão aprovava na hora (shop-process-payment já gravava
-- "approved") o webhook achava que o pedido já estava aprovado e o e-mail nunca saía.
alter table public.shop_orders add column if not exists confirmed_at timestamptz;
update public.shop_orders set confirmed_at = updated_at where status = 'approved' and confirmed_at is null;

create table if not exists public.shop_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.shop_orders(id) on delete cascade,
  mp_payment_id text not null unique,
  payment_method_id text,
  payment_type_id text,
  status text not null,
  status_detail text,
  amount_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shop_payment_attempts_order_idx on public.shop_payment_attempts (order_id, created_at);

-- Mesmo regime de shop_orders: só Edge Functions (service role) leem e escrevem.
alter table public.shop_payment_attempts enable row level security;
