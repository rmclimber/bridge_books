#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p output
pandoc manuscript/00-front-matter.md manuscript/01-static-model-map.md exercises/06-static-model-map.md manuscript/01-runtime-boundaries.md exercises/01-runtime-boundaries.md manuscript/02-values-that-look-familiar.md exercises/02-values-that-look-familiar.md manuscript/03-function-api-design.md exercises/07-function-api-design.md manuscript/03-domain-modeling.md exercises/03-domain-modeling.md manuscript/04-program-structure.md exercises/04-program-structure.md manuscript/04-objects-modules.md exercises/08-objects-modules.md manuscript/05-async-persistence.md exercises/05-async-persistence.md manuscript/05-async-control-flow.md exercises/09-async-control-flow.md exercises/10-persistence-migration.md manuscript/05-testing-debugging.md exercises/11-test-boundaries.md exercises/12-repair-a-false-green-test.md manuscript/06-capstone-integration.md manuscript/06-capstone-iterations.md exercises/13-capstone-increments.md exercises/14-capstone-failure-recovery.md manuscript/07-exit-assessment.md --metadata-file=metadata.yaml --from markdown --pdf-engine=pdflatex --output output/python-to-typescript.pdf

