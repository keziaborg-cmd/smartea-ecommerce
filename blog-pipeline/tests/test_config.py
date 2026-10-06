from pipeline import config


def test_sono_ansiedade_pausa_sao_risco_alto():
    for category in ("sono", "ansiedade", "pausa"):
        assert config.risk_for_category(category) == "alto"


def test_produtividade_e_risco_baixo():
    assert config.risk_for_category("produtividade") == "baixo"
