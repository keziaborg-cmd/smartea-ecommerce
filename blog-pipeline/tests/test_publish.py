from unittest.mock import MagicMock, patch

from pipeline.publish import _unique_slug, publish_all, publish_draft


def _sample_draft(**overrides):
    draft = {
        "title": 'Um título com "aspas" dentro',
        "slug": "um-titulo-de-teste",
        "category": "ansiedade",
        "excerpt": "Resumo de teste.",
        "body_markdown": "Corpo do artigo de teste.",
        "sources_used": [{"title": "Fonte X", "url": "https://exemplo.com/fonte"}],
        "risk": "alto",
        "source_link": "https://fonte.exemplo.com/item",
    }
    draft.update(overrides)
    return draft


def _mock_cursor(existing_slugs=()):
    """Simula o cursor do psycopg: fetchall() devolve as linhas de slug já
    existentes passadas, e execute() não faz nada de verdade."""
    cur = MagicMock()
    cur.fetchall.return_value = [(s,) for s in existing_slugs]
    cm = MagicMock()
    cm.__enter__.return_value = cur
    cm.__exit__.return_value = False
    return cur, cm


def test_dry_run_nao_conecta_no_banco():
    with patch("pipeline.publish.psycopg.connect") as mock_connect:
        ok = publish_draft(_sample_draft(), conn_str="não importa", dry_run=True)
    assert ok is True
    mock_connect.assert_not_called()


def test_publish_draft_insere_com_status_revisao():
    cur, cursor_cm = _mock_cursor()
    conn_cm = MagicMock()
    conn_cm.__enter__.return_value.cursor.return_value = cursor_cm
    conn_cm.__exit__.return_value = False

    with patch("pipeline.publish.psycopg.connect", return_value=conn_cm) as mock_connect:
        ok = publish_draft(_sample_draft(), conn_str="postgresql://exemplo", dry_run=False)

    assert ok is True
    mock_connect.assert_called_once_with("postgresql://exemplo", connect_timeout=15)
    insert_call = next(c for c in cur.execute.call_args_list if "insert into public.blog_posts" in c.args[0])
    assert "'revisao'" in insert_call.args[0]  # status vem fixo no SQL, não como parâmetro
    params = insert_call.args[1]
    assert params["slug"] == "um-titulo-de-teste"
    assert params["title"] == 'Um título com "aspas" dentro'


def test_publish_draft_falha_isolada_nao_lanca():
    with patch("pipeline.publish.psycopg.connect", side_effect=RuntimeError("sem rede")):
        ok = publish_draft(_sample_draft(), conn_str="postgresql://exemplo", dry_run=False)
    assert ok is False


def test_unique_slug_sem_colisao_mantem_o_original():
    cur, _ = _mock_cursor(existing_slugs=[])
    assert _unique_slug(cur, "artigo-novo") == "artigo-novo"


def test_unique_slug_com_colisao_adiciona_sufixo():
    cur, _ = _mock_cursor(existing_slugs=["artigo-novo"])
    assert _unique_slug(cur, "artigo-novo") == "artigo-novo-2"


def test_unique_slug_pula_sufixos_ja_usados():
    cur, _ = _mock_cursor(existing_slugs=["artigo-novo", "artigo-novo-2", "artigo-novo-3"])
    assert _unique_slug(cur, "artigo-novo") == "artigo-novo-4"


def test_publish_all_marca_publicado_no_sqlite_so_quando_insere_com_sucesso(db_module):
    with db_module.connect() as conn:
        db_module.insert_item(
            conn,
            title="Item",
            link="https://fonte.exemplo.com/item",
            published_at=None,
            summary="resumo",
            category="ansiedade",
            source_name="Fonte",
        )
        db_module.save_draft(conn, "https://fonte.exemplo.com/item", _sample_draft())

    with db_module.connect() as conn:
        drafts = db_module.get_drafted_items(conn)

    with patch("pipeline.publish.db", db_module), patch(
        "pipeline.publish.config.require_blog_database_url", return_value="postgresql://exemplo"
    ), patch("pipeline.publish.publish_draft", return_value=True) as mock_publish:
        count = publish_all(drafts, dry_run=False)

    assert count == 1
    assert mock_publish.called

    with db_module.connect() as conn:
        row = conn.execute("select status from items where link = ?", ("https://fonte.exemplo.com/item",)).fetchone()
    assert row["status"] == "published"


def test_publish_all_nao_marca_publicado_quando_insert_falha(db_module):
    with db_module.connect() as conn:
        db_module.insert_item(
            conn,
            title="Item",
            link="https://fonte.exemplo.com/item2",
            published_at=None,
            summary="resumo",
            category="ansiedade",
            source_name="Fonte",
        )
        db_module.save_draft(conn, "https://fonte.exemplo.com/item2", _sample_draft(source_link="https://fonte.exemplo.com/item2"))

    with db_module.connect() as conn:
        drafts = db_module.get_drafted_items(conn)

    with patch("pipeline.publish.db", db_module), patch(
        "pipeline.publish.config.require_blog_database_url", return_value="postgresql://exemplo"
    ), patch("pipeline.publish.publish_draft", return_value=False):
        count = publish_all(drafts, dry_run=False)

    assert count == 0

    with db_module.connect() as conn:
        row = conn.execute("select status from items where link = ?", ("https://fonte.exemplo.com/item2",)).fetchone()
    assert row["status"] == "drafted"
