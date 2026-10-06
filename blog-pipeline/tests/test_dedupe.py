def _insert_sample(db, conn, link="https://exemplo.com/artigo-1"):
    db.insert_item(
        conn,
        title="Um artigo de teste",
        link=link,
        published_at=None,
        summary="Resumo de teste.",
        category="sono",
        source_name="Fonte de Teste",
    )


def test_item_nao_visto_ainda_nao_e_marcado_como_visto(db_module):
    with db_module.connect() as conn:
        assert db_module.already_seen(conn, "https://exemplo.com/nunca-visto") is False


def test_item_inserido_passa_a_ser_visto(db_module):
    with db_module.connect() as conn:
        _insert_sample(db_module, conn)
        assert db_module.already_seen(conn, "https://exemplo.com/artigo-1") is True


def test_inserir_o_mesmo_link_duas_vezes_nao_duplica_a_linha(db_module):
    with db_module.connect() as conn:
        _insert_sample(db_module, conn)
        _insert_sample(db_module, conn)  # mesmo link, "coletado" de novo numa segunda rodada
        rows = conn.execute("SELECT COUNT(*) AS n FROM items").fetchone()
        assert rows["n"] == 1


def test_dedupe_persiste_entre_conexoes_diferentes(db_module):
    """Simula duas execuções separadas do pipeline (cada uma abre e fecha sua
    própria conexão) — o segundo "run" não deve reprocessar o item do primeiro."""
    with db_module.connect() as conn:
        _insert_sample(db_module, conn)

    with db_module.connect() as conn:
        assert db_module.already_seen(conn, "https://exemplo.com/artigo-1") is True


def test_links_diferentes_nao_sao_confundidos(db_module):
    with db_module.connect() as conn:
        _insert_sample(db_module, conn, link="https://exemplo.com/artigo-1")
        assert db_module.already_seen(conn, "https://exemplo.com/artigo-2") is False
