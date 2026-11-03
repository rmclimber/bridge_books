#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
pandoc manuscript/00-front-matter.md --metadata-file=metadata.yaml --from markdown --pdf-engine=pdflatex --output output/python-to-typescript.pdf

