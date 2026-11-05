$ErrorActionPreference = "Stop"
$bookRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $bookRoot "output"
Set-Location $bookRoot
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$sources = @(
  "workbook/book.md",
  "solutions/01-runtime-boundaries.md",
  "solutions/02-values-that-look-familiar.md",
  "solutions/03-domain-modeling.md",
  "solutions/04-program-structure.md",
  "solutions/05-async-persistence.md",
  "solutions/06-exit-assessment.md",
  "solutions/07-static-model-map.md",
  "solutions/08-function-api-design.md",
  "solutions/09-objects-modules.md",
  "solutions/10-async-control-flow.md",
  "solutions/11-persistence-migration.md",
  "solutions/12-test-boundaries.md",
  "solutions/13-repair-a-false-green-test.md"
)
pandoc $sources --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript-workbook.pdf")

