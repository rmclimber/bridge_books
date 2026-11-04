# Project State

## Current phase

The planned instructional slices are complete. The book is ready for external
reader/practitioner review and release decisions.

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
- Completed the domain-modeling slice: discriminated unions, `Map`/`Set`,
  generic constraints, and static structural typing, with executable examples,
  Exercise 3, and a worked solution.
- Completed the program-structure slice: Node ESM imports, focused module
  functions and classes, and `this` callback behavior, with executable
  examples, Exercise 4, and a worked solution.
- Completed the promises, asynchronous persistence, errors, and tests slice:
  checked filesystem-port example, Promise-aware tests, Exercise 5, and a
  worked solution.
- Completed capstone integration: framework-free task-ledger commands,
  acceptance tests, persisted task transitions, and a documented CLI surface.
- Completed the exit assessment and production pass: independent extension
  brief, scoring rubric, evaluator guide, and whole-book build verification.

## In progress

- No implementation slice is active.

## Next priorities

1. Obtain an experienced TypeScript practitioner review.
2. Trial the exit assessment with experienced Python programmers new to
   TypeScript and revise persistent misunderstandings.
3. Decide whether HTML/ePub and the solutions workbook ship in the first release.

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

- Main build: passed, 2026-11-04 (visual PDF inspection passed; 13 pages)
- Workbook build: passed, 2026-11-04 (visual PDF inspection passed; 5 pages)
- Repository checks: passed, 2026-11-04 (type-check, snippet verification,
  and 17 Node tests)
- Release status: unreleased; draft complete, external review pending

