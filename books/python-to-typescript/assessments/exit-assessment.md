# Exit assessment: extend the task ledger

Work independently in a new branch or copy of this repository. Do not consult
the workbook until you have run your own checks and recorded your explanation.

## Scenario

The task ledger needs a paused state for work blocked on an external decision.
Existing `open` and `done` tasks must continue to load. An older
`tasks.json` file contains only those two states.

## Deliverables

1. Add `{ kind: "paused"; reason: string }` to `TaskState`. A pause reason
   must be non-empty after trimming.
2. Migrate the persistence parser so it accepts persisted paused tasks, rejects
   missing or blank reasons, and still rejects malformed timestamps for done
   tasks.
3. Add `pause <id> <reason>` to the task-ledger command layer. It must:
   - await persistence before reporting success;
   - reject a missing task and an already-done task;
   - preserve the task ID, title, and labels;
   - report `Paused <id>` only after saving.
4. Fix the existing command bug: `add "" "Title"` must reject instead of persisting
   an empty ID.
5. Add focused tests for the migration, pause command, and empty-ID regression.
   Run `pnpm run check`.
6. Write 150--250 words answering:
   - Why does a TypeScript type change not migrate existing JSON by itself?
   - Which errors are expected command/domain errors versus unexpected I/O
     failures, and where should each be handled?
   - Why must the pause command await `save` before it writes success output?

## Acceptance evidence

Your test evidence must demonstrate all of the following:

- A legacy open task still loads.
- A paused task round-trips with its reason.
- A blank paused reason rejects at the persistence boundary.
- `pause` reports success only after persistence resolves.
- Empty IDs never reach the stored JSON.
- The full repository check remains green.

## Scoring rubric

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Domain and migration | Missing | Union only | Validates paused JSON | Preserves all variants and invariants |
| Async command behavior | Missing | Starts a save | Awaits save | Correct results and failure paths |
| Tests and regression | Missing | Happy path only | Covers new feature | Covers migration, failure, and regression |
| Explanation | Missing | Names concepts | Explains mechanics | Connects types, runtime data, and errors |

Score each dimension from 0--3. A score of 9 or more, with no zero in the
first three dimensions, meets this book's exit bar. This is evidence of
readiness for the scoped Node.js work in this book, not a guarantee of
framework expertise or interview performance.
