-- Captura de e-mail nas páginas de artigo do blog. Mesmo padrão de
-- `shop_quiz_responses` (ver 20260812230000_shop_schema.sql): insert público,
-- sem select público — ninguém além do service role lê essa tabela.
create table if not exists public.blog_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source_slug text,
  created_at timestamptz not null default now()
);

create unique index if not exists blog_subscribers_email_idx on public.blog_subscribers (email);

alter table public.blog_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.blog_subscribers;
create policy "anyone can subscribe"
  on public.blog_subscribers for insert
  with check (true);
