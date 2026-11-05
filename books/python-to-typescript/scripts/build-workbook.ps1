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
  "solutions/07-static-model-map.md"
)
pandoc $sources --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript-workbook.pdf")

