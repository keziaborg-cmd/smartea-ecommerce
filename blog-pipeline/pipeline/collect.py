import logging
from datetime import datetime, timedelta, timezone

import feedparser
import yaml

from . import config, db

logger = logging.getLogger("blog_pipeline.collect")


def load_sources() -> dict:
    with open(config.SOURCES_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def _entry_published(entry):
    for key in ("published_parsed", "updated_parsed"):
        value = getattr(entry, key, None)
        if value:
            return datetime(*value[:6], tzinfo=timezone.utc)
    return None


def collect_from_feed(conn, *, category: str, source_name: str, url: str, since: datetime) -> int:
    """Busca um feed RSS/Atom e grava os itens novos (publicados depois de
    `since`) no SQLite. Devolve quantos itens novos foram gravados.

    Nunca derruba a coleta inteira por causa de uma fonte com problema —
    qualquer erro aqui vira log e a coleta segue pras próximas fontes."""
    try:
        parsed = feedparser.parse(url)
    except Exception as exc:  # feedparser raramente lança, mas a rede é instável
        logger.warning("Falha ao buscar feed '%s' (%s): %s", source_name, url, exc)
        return 0

    if parsed.bozo and not parsed.entries:
        logger.warning(
            "Feed '%s' (%s) não pôde ser lido: %s", source_name, url, parsed.get("bozo_exception")
        )
        return 0

    new_count = 0
    for entry in parsed.entries:
        link = getattr(entry, "link", None)
        title = getattr(entry, "title", None)
        if not link or not title:
            continue

        published = _entry_published(entry)
        if published and published < since:
            continue

        if db.already_seen(conn, link):
            continue

        summary = getattr(entry, "summary", "") or ""
        db.insert_item(
            conn,
            title=title,
            link=link,
            published_at=published.isoformat() if published else None,
            summary=summary,
            category=category,
            source_name=source_name,
        )
        new_count += 1

    return new_count


def collect_all() -> int:
    """Percorre sources.yaml inteiro. Retorna o total de itens novos gravados."""
    sources = load_sources()
    since = datetime.now(timezone.utc) - timedelta(days=config.COLLECT_WINDOW_DAYS)
    total_new = 0

    with db.connect() as conn:
        for category, entries in sources.items():
            if category not in config.CATEGORIES:
                logger.warning("Categoria desconhecida em sources.yaml: '%s' (ignorada).", category)
                continue

            for entry in entries or []:
                name = entry.get("name", entry.get("url", "fonte sem nome"))
                source_type = entry.get("type", "rss")
                url = entry.get("url")

                if not url:
                    logger.warning("Fonte '%s' sem 'url' — pulando.", name)
                    continue

                if source_type == "page":
                    logger.info(
                        "Fonte '%s' é type: page — scraping genérico de página ainda não "
                        "implementado nesta versão (só type: rss). Pulando. Ver README.md.",
                        name,
                    )
                    continue

                if source_type != "rss":
                    logger.warning("Fonte '%s' tem type: %s desconhecido — pulando.", name, source_type)
                    continue

                new_count = collect_from_feed(conn, category=category, source_name=name, url=url, since=since)
                total_new += new_count
                logger.info("%s (%s): %d item(ns) novo(s).", name, category, new_count)

    return total_new
