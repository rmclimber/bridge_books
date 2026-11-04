$ErrorActionPreference = "Stop"
$bookRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $bookRoot "output"
Set-Location $bookRoot
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$sources = @(
  "manuscript/00-front-matter.md",
  "manuscript/01-runtime-boundaries.md",
  "exercises/01-runtime-boundaries.md",
  "manuscript/02-values-that-look-familiar.md",
  "exercises/02-values-that-look-familiar.md"
)
pandoc $sources --metadata-file=metadata.yaml --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript.pdf")

