# Project State

## Current phase

The validated foundation is complete, but the book is materially below its
approved length and competency depth. Expansion toward the intended full
Python-to-TypeScript transition is in progress.

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
- Completed the initial exit-assessment and production-pass seed: independent
  extension brief, scoring rubric, evaluator guide, and whole-book build
  verification.

## In progress

- Planning E1: orientation and static-model foundations.

## Next priorities

1. Implement E1 from `EXPANSION_PLAN.md`.
2. Continue E2--E7 with their stated page and assessment gates.
3. Conduct the first whole-book integration review at 30--35 reader pages.

## Open decisions

- Whether HTML/ePub are release artifacts in addition to PDF.
- Whether the solutions workbook ships with the first public release.

## Known issues / technical debt

- The pilot is deliberately narrow; it does not yet cover schema libraries,
  recursive validation, or error aggregation.
- The 13-page manuscript and 5-page workbook are foundations, not
  release-ready artifacts. The approved targets remain 52--64 and 25--35
  pages respectively; see `EXPANSION_PLAN.md`.
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
  one exercise each; retain this clarity, but expand missing competencies with
  additional evidence rather than treating this early-chapter convention as a
  whole-book length limit.
- Page targets are integration gates. A passing build does not authorize a
  release claim when competency or page-budget gaps remain.
- Page targets are estimates, not quotas. Stop a topic when its learning
  outcome has sufficient evidence; never add prose, examples, or exercises
  merely to increase page count.

## Last validated state

- Main build: passed, 2026-11-04 (visual PDF inspection passed; 13 pages)
- Workbook build: passed, 2026-11-04 (visual PDF inspection passed; 5 pages)
- Repository checks: passed, 2026-11-04 (type-check, snippet verification,
  and 17 Node tests)
- Release status: unreleased; foundation validated, expansion required before
  external review or release.

