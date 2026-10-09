-- Rebrand Smartea → Almara: o autor institucional do blog passa a ser "equipe-almara".
-- O site reconhece o slug antigo (data/blog-authors.ts, legacySlugs) e /blog/autor/equipe-smartea
-- redireciona com 301, então esta migration pode ser aplicada antes ou depois do deploy.
update public.blog_posts set author = 'equipe-almara' where author = 'equipe-smartea';
alter table public.blog_posts alter column author set default 'equipe-almara';
