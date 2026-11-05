# Exit assessment: migrate task priority

Work independently in a fresh branch or copy. Do not open the workbook until
you have run your own checks and recorded an explanation.

## Scenario

The ledger needs a priority for planning work. Existing JSON has no priority
field, so it must keep loading with a deliberate default. Use
`priority-extension.fixture.json` as legacy input. This is not a repeat of the
guided `pause` feature.

## Deliverables

1. Add a `Priority` model with only `"low"`, `"normal"`, and `"high"`, plus a
   required `priority` on trusted `Task` values.
2. At the persistence boundary, migrate a missing JSON priority to `"normal"`.
   Reject a present priority outside those literals. Keep open, paused, and
   done validation intact.
3. Add `prioritize <id> <priority>`. It validates input, preserves other task
   fields, awaits save, then prints `Prioritized <id> <priority>`.
4. Add read-only `list --priority <priority>`. Invalid literals reject with
   usage rather than silently returning no tasks.
5. Test legacy defaulting, malformed JSON, command validation, success, a
   no-write query, and a failed save with no success output. Run `pnpm run check`.
6. In 180--260 words explain why defaulting belongs at the persistence boundary,
   which facts are syntax/domain/JSON rules, and why save must settle first.

## Acceptance evidence

- Legacy tasks load as normal priority.
- All priorities round-trip; invalid persisted priority rejects as data error.
- `prioritize` changes only its target and reports only after save.
- `list --priority high` does not write.
- A rejected write preserves known-good fake-file text and emits no success.

## Rubric

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Domain and migration | Missing | Broad string/cast | Parses literals and defaults legacy data | Preserves invariants across states |
| Command behavior | Missing | Happy path | Validates and awaits save | Separates syntax, domain, failure paths |
| Tests | Missing | New command only | Migration and success | Legacy, malformed, no-write, failed-save |
| Explanation | Missing | Names concepts | Explains boundaries | Connects data, Promise order, maintenance |

A score of 9/12, with no zero in the first three rows, meets the scoped exit
bar. It is evidence of readiness for this Node work, not framework expertise.
