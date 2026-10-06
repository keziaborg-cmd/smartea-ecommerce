-- Conteúdo do blog, agora em banco (substitui o Markdown em content/blog/ da primeira versão) —
-- a revisão humana passou a acontecer no painel smartea-metrics (aba "Blog"), não mais por PR no
-- GitHub. Só duas situações: "revisao" (nasce assim, nunca aparece publicamente) e "publicado"
-- (decidido por uma pessoa no painel — nunca automático).
--
-- Dois escritores, dois roles, mesmo raciocínio de isolamento já usado em shop_* e
-- blog_subscribers (ver smartea-metrics/db/004_journeys_write_role.sql pro precedente mais
-- próximo, do CRM de jornadas dinâmicas):
--   * blog_pipeline_writer (definido aqui, GitHub Actions do blog-pipeline usa) — só INSERE,
--     nunca lê nem atualiza uma linha já existente, e a linha nasce sempre em "revisao" (garantido
--     por RLS, não só por boa vontade do código Python).
--   * metrics_blog (definido em smartea-metrics/db/005_blog_write_role.sql) — lê e escreve os dois
--     status, decide quando publicar. Papel desse role fica inteiramente no outro repositório; ele
--     só precisa que esta tabela exista.
-- O site (anon/authenticated, client público) só enxerga "publicado" — mesma régua de
-- shop_products.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('sono', 'ansiedade', 'produtividade', 'pausa')),
  excerpt text not null,
  author text not null default 'equipe-smartea',
  body_markdown text not null,
  sources jsonb not null default '[]'::jsonb,
  risk text not null check (risk in ('alto', 'baixo')),
  status text not null default 'revisao' check (status in ('revisao', 'publicado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts publicados são públicos" on public.blog_posts;
create policy "blog_posts publicados são públicos"
  on public.blog_posts for select
  using (status = 'publicado');

-- Role do pipeline Python (blog-pipeline/pipeline/publish.py). Nologin — a senha é definida à
-- parte (mesmo passo manual dos outros roles deste projeto), e a connection string fica num
-- secret do GitHub Actions (BLOG_DATABASE_URL), nunca em código.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'blog_pipeline_writer') then
    create role blog_pipeline_writer nologin;
  end if;
end;
$$;

alter role blog_pipeline_writer set statement_timeout = '15s';

revoke all on schema public from blog_pipeline_writer;
grant usage on schema public to blog_pipeline_writer;
revoke all on all tables in schema public from blog_pipeline_writer;

-- Só a coluna slug, só pra checar colisão antes de inserir (gerar um slug único) — nunca lê
-- título, corpo nem qualquer outro dado de um rascunho já existente.
grant select (slug) on public.blog_posts to blog_pipeline_writer;
grant insert on public.blog_posts to blog_pipeline_writer;

-- A checagem de colisão de slug precisa enxergar TODA linha (revisão ou publicada) — a policy
-- pública (status = 'publicado') não cobre rascunho, e sem policy própria aqui o pipeline "nunca
-- vê" um rascunho e gera um slug que colide, estourando a constraint unique na hora do insert. Não
-- é problema de sigilo: o GRANT acima já restringe à coluna slug, que não é sensível em nenhum dos
-- dois status.
drop policy if exists blog_pipeline_writer_select on public.blog_posts;
create policy blog_pipeline_writer_select on public.blog_posts
  for select to blog_pipeline_writer
  using (true);

-- Garantia de banco, não só de código: mesmo que o pipeline tenha um bug e tente inserir um post
-- já "publicado", a linha nasce sempre em revisão. Quem decide publicar é sempre uma pessoa, no
-- painel smartea-metrics.
drop policy if exists blog_pipeline_writer_insert on public.blog_posts;
create policy blog_pipeline_writer_insert on public.blog_posts
  for insert to blog_pipeline_writer
  with check (status = 'revisao');
