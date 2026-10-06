#!/usr/bin/env python3
"""CLI do pipeline de rascunhos do blog da Smartea.

Uso:
    python run.py                  # roda tudo em sequência: coleta -> classifica -> escreve -> publica
    python run.py --stage collect  # só busca itens novos nos feeds
    python run.py --stage classify # só classifica os itens pendentes
    python run.py --stage write    # só escreve os artigos dos itens selecionados
    python run.py --stage publish  # só abre PR dos rascunhos já escritos (lidos do banco)
    python run.py --dry-run        # roda tudo, mas não cria branch nem abre PR de verdade

Cada etapa é resumível — o estado fica salvo no SQLite (blog-pipeline/data/pipeline.sqlite3),
então rodar "--stage publish" sozinho não precisa ter rodado "write" na mesma execução.
"""
import argparse
import logging
import sys

from pipeline import classify, collect, config, db, write, publish


def main() -> int:
    parser = argparse.ArgumentParser(description="Pipeline de rascunhos do blog Smartea")
    parser.add_argument(
        "--stage",
        choices=["collect", "classify", "write", "publish", "all"],
        default="all",
        help="Qual etapa rodar (padrão: all)",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Não cria branch nem abre PR de verdade, só mostra o que seria feito"
    )
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    logger = logging.getLogger("blog_pipeline")

    stages = ["collect", "classify", "write", "publish"] if args.stage == "all" else [args.stage]

    for stage in stages:
        if stage == "collect":
            new_count = collect.collect_all()
            logger.info("Coleta concluída: %d item(ns) novo(s).", new_count)

        elif stage == "classify":
            classified_count = classify.classify_pending()
            selected = classify.select_top_items()
            total_selected = sum(len(v) for v in selected.values())
            logger.info(
                "Classificação concluída: %d item(ns) classificado(s), %d selecionado(s) no total (top %d por categoria).",
                classified_count,
                total_selected,
                config.TOP_N_PER_CATEGORY,
            )

        elif stage == "write":
            selected = classify.select_top_items()
            drafts = write.write_selected(selected)
            logger.info("Redação concluída: %d rascunho(s) gerado(s).", len(drafts))

        elif stage == "publish":
            with db.connect() as conn:
                drafts = db.get_drafted_items(conn)
            published_count = publish.publish_all(drafts, dry_run=args.dry_run)
            logger.info(
                "Publicação concluída: %d de %d rascunho(s) viraram PR (ou foram simulados, em --dry-run).",
                published_count,
                len(drafts),
            )

    return 0


if __name__ == "__main__":
    sys.exit(main())
