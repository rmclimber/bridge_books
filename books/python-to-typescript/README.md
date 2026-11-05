# Python to TypeScript

A concise, practice-driven bridge for experienced Python programmers learning
strict TypeScript in a Node.js professional workflow.

## Status

The repository contains a validated foundation plus six competency-driven
expansion slices, capstone integration, and an exit-assessment seed. It is not
yet the planned book-length transition.
The current material covers runtime boundaries; absence, equality, numeric
limits, and mutation; domain modeling with unions, collections, generics, and
structural typing; plus Node ESM modules, focused functions/classes, and
`this` callback behavior; plus Promises, asynchronous task persistence, errors,
and tests; plus async control flow, migration, test boundaries, debugging, and
maintainable-change workflow; plus incremental capstone changes for labels,
filtered views, paused-state compatibility, failure behavior, and reporting.

The `task-ledger` capstone integrates those modules behind `list`, `add`,
`label`, `pause`, `complete`, and `report` commands. See `capstone/README.md`.
The independent final assessment and scoring rubric are in
`assessments/exit-assessment.md`.

`EXPANSION_PLAN.md` is the authoritative roadmap for the remaining
competency-driven expansion to the 52--64-page manuscript and 25--35-page
workbook targets.

## Commands

```powershell
pnpm install --frozen-lockfile
pnpm run check
./scripts/build.ps1
./scripts/build-workbook.ps1
```

The commands are run from this directory. See `PROJECT_GUIDE.md` for the
production standard and `PROJECT_STATE.md` for current work.

