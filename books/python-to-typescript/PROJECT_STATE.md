# Project State

## Current phase

The runtime-boundary pilot is complete; the book is ready for its next
vertical slice on absence, equality, numeric limits, and mutation.

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

## In progress

- Planning the next approved vertical slice.

## Next priorities

1. Implement the absence, equality, numeric-limits, and mutation slice.
2. Add its executable examples, exercises, solutions, and matrix evidence.
3. Reassess page density after the second substantive slice.

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

## Last validated state

- Main build: passed, 2026-11-04 (visual PDF inspection passed)
- Workbook build: passed, 2026-11-04 (visual PDF inspection passed)
- Repository checks: passed, 2026-11-04 (type-check, snippet verification,
  and 3 Node tests)
- Release status: unreleased; one pilot slice drafted

