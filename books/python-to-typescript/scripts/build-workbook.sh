#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
pandoc workbook/book.md solutions/01-runtime-boundaries.md solutions/02-values-that-look-familiar.md solutions/03-domain-modeling.md solutions/04-program-structure.md --from markdown --pdf-engine=pdflatex --output output/python-to-typescript-workbook.pdf

