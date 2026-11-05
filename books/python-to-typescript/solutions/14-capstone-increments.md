# Exercise 13: Plan a capstone increment -- solution

## Change map

| Boundary | Change? | Evidence |
| --- | --- | --- |
| Domain | No new state for labels or counts | `labels` already belongs to `Task` |
| Persistence | No format change | a filtered list performs no write |
| Command | Yes | `label`, filtered `list`, and `report` parse tokens |
| Output | Yes | filtered task lines and one count line |
| Tests | Yes | duplicate label, filtered view, and all-state report |

The important restraint is the first two rows. A feature may need a new command
without requiring a new JSON shape or a new union variant.

## Worked solution

`label` loads the task, creates a new labels list only when its normalized
label is absent, saves it, and then reports success. `list --label` loads and
filters; it never calls `save`. `report` receives trusted tasks and counts
their discriminant values. The acceptance test can invoke those commands in
sequence with an in-memory file port, then compare the lines and persisted
JSON.

`report` is a read model because it is derived from the authoritative task
list at the time the command runs. Persisting the count separately would add a
second value that every mutation must keep synchronized. The local ledger does
not have a measured performance need that justifies that new consistency risk.

## Common wrong turns

- Treating repeated labels as an error makes a harmless retry less useful;
  idempotent addition is a clearer contract here.
- Saving after `list --label` turns a query into an unexpected mutation.
- Counting only open and done states lets a new union variant disappear from a
  report without an obvious runtime error.
