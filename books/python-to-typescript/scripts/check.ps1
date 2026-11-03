$ErrorActionPreference = "Stop"
$bookRoot = Split-Path -Parent $PSScriptRoot
Set-Location $bookRoot

pnpm run check

