from pipeline.write import slugify


def test_slugify_remove_acentos_e_espacos():
    assert slugify("Uma Respiração Simples Para a Ansiedade") == "uma-respiracao-simples-para-a-ansiedade"


def test_slugify_remove_pontuacao():
    assert slugify("Pausas curtas: por que elas importam?") == "pausas-curtas-por-que-elas-importam"


def test_slugify_nunca_fica_vazio():
    assert slugify("!!!") == "artigo"
