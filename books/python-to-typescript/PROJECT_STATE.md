# Project State

## Current phase

Repository foundation complete; runtime-boundary pilot is next.

## Completed

- Selected the Python -> TypeScript directed bridge.
- Approved a strict-TypeScript, general Node.js library/CLI context.
- Defined provisional exit competencies, misconception priorities, capstone,
  exit assessment, outline, and vertical slices.

## In progress

- Resolving the certificate-chain configuration needed for the first locked
  dependency install.

## Next priorities

1. Resolve the first locked dependency install and validate example checks.
2. Implement the approved runtime-boundary pilot slice.
3. Revise page-density and source-inclusion conventions using the pilot.

## Open decisions

- Exact final supported Node and TypeScript patch versions after the first
  locked install.
- Whether HTML/ePub are release artifacts in addition to PDF.
- Whether the solutions workbook ships with the first public release.

## Known issues / technical debt

- No instructional manuscript material has been drafted yet.
- The initial executable code is an infrastructure smoke test, not a learner
  example.
- The initial package install could not complete because the local npm registry
  connection rejected its certificate chain; no lockfile has been generated.

## Important conventions currently in force

- Playbook v0.5 is the pinned production standard.
- Markdown is canonical; generated artifacts belong in `output/`.
- Examples and assessments must be independently executable where practical.
- The core book excludes framework specialization.

## Last validated state

- Main build: passed, 2026-11-03 (visual PDF inspection passed)
- Workbook build: passed, 2026-11-03 (visual PDF inspection passed)
- Repository checks: blocked pending the first locked dependency install
- Release status: unreleased foundation

