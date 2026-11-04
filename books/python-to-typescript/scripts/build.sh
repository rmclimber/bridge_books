#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
pandoc manuscript/00-front-matter.md manuscript/01-runtime-boundaries.md exercises/01-runtime-boundaries.md manuscript/02-values-that-look-familiar.md exercises/02-values-that-look-familiar.md manuscript/03-domain-modeling.md exercises/03-domain-modeling.md --metadata-file=metadata.yaml --from markdown --pdf-engine=pdflatex --output output/python-to-typescript.pdf

