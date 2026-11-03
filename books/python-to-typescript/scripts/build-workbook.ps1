$ErrorActionPreference = "Stop"
$bookRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $bookRoot "output"
Set-Location $bookRoot
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

pandoc workbook/book.md --from markdown --pdf-engine=pdflatex --output (Join-Path $outputDir "python-to-typescript-workbook.pdf")

