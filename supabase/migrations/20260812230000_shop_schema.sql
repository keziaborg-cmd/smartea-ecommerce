-- Smartea website e-commerce schema.
-- Isolated from the Smartea+ (Expo) app tables via the shop_ prefix — see
-- design-bundle/README.md for the product/checkout spec this backs.
-- All tables live in `public`, alongside the app's tables, but under a
-- distinct naming prefix so there is no name collision.

create table public.shop_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_cents integer not null,
  weight_grams integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shop_customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nome text not null,
  telefone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  access_token uuid not null default gen_random_uuid(),
  customer_id uuid references public.shop_customers(id),
  nome text not null,
  email text not null,
  telefone text not null,
  cep text not null,
  rua text not null,
  numero text not null,
  complemento text,
  bairro text not null,
  cidade text not null,
  uf text not null,
  shipping_method text not null check (shipping_method in ('padrao', 'retirada')),
  shipping_fee_cents integer not null default 0,
  subtotal_cents integer not null,
  total_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  mp_preference_id text,
  mp_payment_id text,
  mp_payment_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shop_orders_order_number_idx on public.shop_orders (order_number);
create index shop_orders_access_token_idx on public.shop_orders (access_token);
create index shop_orders_mp_preference_id_idx on public.shop_orders (mp_preference_id);

create table public.shop_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.shop_orders(id) on delete cascade,
  product_id uuid references public.shop_products(id),
  product_slug text not null,
  product_name text not null,
  unit_price_cents integer not null,
  qty integer not null check (qty > 0),
  subtotal_cents integer not null
);

create index shop_order_items_order_id_idx on public.shop_order_items (order_id);

create table public.shop_quiz_responses (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  primary_result_slug text not null,
  secondary_result_slug text,
  created_at timestamptz not null default now()
);

-- RLS: locked down by default. Orders/customers/order items are written and
-- read only through Edge Functions using the service role key, so price and
-- PII integrity never depend on client-supplied data. shop_products is
-- readable by anyone (public catalog). shop_quiz_responses accepts
-- anonymous inserts (no PII, low risk) but cannot be read back by clients.

alter table public.shop_products enable row level security;
alter table public.shop_customers enable row level security;
alter table public.shop_orders enable row level security;
alter table public.shop_order_items enable row level security;
alter table public.shop_quiz_responses enable row level security;

create policy "shop_products are publicly readable"
  on public.shop_products for select
  using (active = true);

create policy "anyone can record a quiz response"
  on public.shop_quiz_responses for insert
  with check (true);

insert into public.shop_products (slug, name, price_cents, weight_grams) values
  ('cha-verde', 'Chá Verde', 2990, 150),
  ('camomila', 'Camomila', 2490, 100),
  ('jasmin', 'Jasmin', 2790, 80),
  ('cha-preto', 'Chá Preto', 3290, 180),
  ('cidreira', 'Cidreira', 2690, 120),
  ('hibisco', 'Hibisco', 3490, 200);
