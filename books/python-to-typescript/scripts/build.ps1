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
  "exercises/02-values-that-look-familiar.md",
  "manuscript/03-domain-modeling.md",
  "exercises/03-domain-modeling.md",
  "manuscript/04-program-structure.md",
  "exercises/04-program-structure.md",
  "manuscript/05-async-persistence.md",
  "exercises/05-async-persistence.md",
  "manuscript/06-capstone-integration.md",
  "manuscript/07-exit-assessment.md"
)
pandoc $sources --metadata-file=metadata.yaml --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript.pdf")

