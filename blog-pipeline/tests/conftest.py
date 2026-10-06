import importlib

import pytest


@pytest.fixture
def db_module(tmp_path, monkeypatch):
    """Aponta o banco do pipeline pra um arquivo temporário isolado por
    teste, em vez do banco real (blog-pipeline/data/pipeline.sqlite3) — cada
    teste parte de um banco vazio e não deixa nada pra trás."""
    monkeypatch.setenv("BLOG_PIPELINE_DB_PATH", str(tmp_path / "test.sqlite3"))

    # config.py lê a env var só na hora do import, então tudo que já importou
    # config/db antes deste fixture rodar precisa ser recarregado.
    from pipeline import config as config_module
    from pipeline import db as db_module

    importlib.reload(config_module)
    importlib.reload(db_module)
    return db_module
