import logging

import psycopg
from psycopg.types.json import Jsonb

from . import config, db

logger = logging.getLogger("blog_pipeline.publish")

INSERT_SQL = """
insert into public.blog_posts (title, slug, category, excerpt, body_markdown, sources, risk, status)
values (%(title)s, %(slug)s, %(category)s, %(excerpt)s, %(body_markdown)s, %(sources)s, %(risk)s, 'revisao')
"""


def _unique_slug(cur, base_slug: str) -> str:
    """Evita colidir com um slug já existente (revisão ou publicado — o role
    blog_pipeline_writer enxerga a coluna slug das duas situações, ver a
    migration do e-commerce). A constraint unique no banco continua sendo a
    garantia de verdade contra corrida; isto só evita o caso comum de dois
    artigos saindo com o mesmo título."""
    cur.execute(
        "select slug from public.blog_posts where slug = %(slug)s or slug like %(prefix)s",
        {"slug": base_slug, "prefix": f"{base_slug}-%"},
    )
    existing = {row[0] for row in cur.fetchall()}
    if base_slug not in existing:
        return base_slug
    n = 2
    while f"{base_slug}-{n}" in existing:
        n += 1
    return f"{base_slug}-{n}"


def publish_draft(draft: dict, *, conn_str: str, dry_run: bool = False) -> bool:
    """Insere um rascunho em public.blog_posts, sempre em status "revisao" —
    quem decide publicar é uma pessoa, no painel almara-metrics (aba
    "Blog"), nunca este pipeline. Devolve True se o insert teve sucesso (ou
    se dry_run)."""
    if dry_run:
        logger.info(
            "[dry-run] Inseriria em blog_posts: '%s' (categoria %s, risco %s, %d fonte(s))",
            draft["title"],
            draft["category"],
            draft["risk"],
            len(draft["sources_used"]),
        )
        return True

    try:
        with psycopg.connect(conn_str, connect_timeout=15) as pg_conn:
            with pg_conn.cursor() as cur:
                slug = _unique_slug(cur, draft["slug"])
                cur.execute(
                    INSERT_SQL,
                    {
                        "title": draft["title"],
                        "slug": slug,
                        "category": draft["category"],
                        "excerpt": draft["excerpt"],
                        "body_markdown": draft["body_markdown"],
                        "sources": Jsonb(draft["sources_used"]),
                        "risk": draft["risk"],
                    },
                )
    except Exception as exc:
        logger.error("Falha ao inserir '%s' em blog_posts: %s", draft["title"], exc)
        return False

    logger.info("Post '%s' inserido em blog_posts (slug '%s'), status 'revisao'.", draft["title"], slug)
    return True


def publish_all(drafts: list, *, dry_run: bool = False) -> int:
    """Insere um post por rascunho. Devolve quantos inserts tiveram sucesso
    (ou foram simulados, em dry-run)."""
    published_count = 0
    conn_str = None if dry_run else config.require_blog_database_url()
    with db.connect() as conn:
        for draft in drafts:
            ok = publish_draft(draft, conn_str=conn_str, dry_run=dry_run)
            if ok:
                published_count += 1
                if not dry_run and draft.get("source_link"):
                    db.mark_published(conn, draft["source_link"])
    return published_count
