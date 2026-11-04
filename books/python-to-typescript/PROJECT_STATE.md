# Project State

## Current phase

Two foundation slices are complete; the book is ready for domain modeling with
unions, collections, generics, and structural typing.

## Completed

- Selected the Python -> TypeScript directed bridge.
- Approved a strict-TypeScript, general Node.js library/CLI context.
- Defined provisional exit competencies, misconception priorities, capstone,
  exit assessment, outline, and vertical slices.
- Generated `pnpm-lock.yaml` for the documented Node 24 / TypeScript 5.9
  toolchain and validated the TypeScript example checks.
- Completed the runtime-boundary pilot: executable parser, tests, learner
  exercise, worked solution, manuscript chapter, and independently built
  workbook material.
- Added a checked manuscript-snippet convention so executable source excerpts
  cannot silently drift from the book.
- Completed the values-that-look-familiar slice: absence, strict equality,
  numeric limits, and mutation, with executable examples, Exercise 2, and a
  worked solution.

## In progress

- Planning the domain-modeling vertical slice.

## Next priorities

1. Implement the unions, collections, generics, and structural-typing slice.
2. Add its executable examples, exercises, solutions, and matrix evidence.
3. Begin linking the domain-modeling examples to the task-tracker capstone.

## Open decisions

- Whether HTML/ePub are release artifacts in addition to PDF.
- Whether the solutions workbook ships with the first public release.

## Known issues / technical debt

- The pilot is deliberately narrow; it does not yet cover schema libraries,
  recursive validation, or error aggregation.
- In this managed Windows environment, dependency installation requires the
  Windows system CA store and must bypass injected offline/proxy variables.

## Important conventions currently in force

- Playbook v0.5 is the pinned production standard.
- Markdown is canonical; generated artifacts belong in `output/`.
- Examples and assessments must be independently executable where practical.
- The core book excludes framework specialization.
- Manuscript excerpts marked `<!-- snippet: ... -->` must match their tagged
  executable source region; `pnpm run verify:snippets` enforces this.
- The early chapters use compact prose with one substantial checked example and
  one exercise each; do not pad a short terminal exercise page merely to fill it.

## Last validated state

- Main build: passed, 2026-11-04 (visual PDF inspection passed; 5 pages)
- Workbook build: passed, 2026-11-04 (visual PDF inspection passed; 2 pages)
- Repository checks: passed, 2026-11-04 (type-check, snippet verification,
  and 7 Node tests)
- Release status: unreleased; two foundation slices drafted

