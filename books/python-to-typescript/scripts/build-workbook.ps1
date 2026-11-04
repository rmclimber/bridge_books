$ErrorActionPreference = "Stop"
$bookRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $bookRoot "output"
Set-Location $bookRoot
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$sources = @(
  "workbook/book.md",
  "solutions/01-runtime-boundaries.md"
)
pandoc $sources --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript-workbook.pdf")

