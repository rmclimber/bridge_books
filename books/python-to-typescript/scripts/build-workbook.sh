#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
pandoc workbook/book.md --from markdown --pdf-engine=pdflatex --output output/python-to-typescript-workbook.pdf

