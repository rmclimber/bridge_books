# Exit assessment: evaluator guide

## Evaluation approach

First confirm the learner worked independently before consulting this guide.
Then run `pnpm run check`, read the added tests, and score the four rubric
dimensions in `assessments/exit-assessment.md`.

## Expected design

The reference solution adds a literal `"paused"` variant with a required
`reason`. The persistence parser recognizes the variant only when the reason
is a non-empty string after trimming; this is a runtime migration, not a cast.
Legacy open and done JSON keeps its existing behavior.

The command layer adds `pause <id> <reason>`. It loads before deciding whether
the task exists or is already done, replaces only the target task's state, and
awaits `save` before emitting `Paused <id>`. A blank ID is rejected at
the command boundary before any save. These checks are intentionally split:
the command owns command syntax and state transitions, while persistence owns
untrusted JSON shape.

## Common incorrect answers

- Adding `reason?: string` weakens the state model and forces every consumer to
  defend against invalid paused tasks.
- Changing only `TaskState` does not migrate JSON. Types are erased and JSON
  dates remain strings.
- Calling `save` without `await` can print success before a failed write.
- Catching every error and returning an empty list hides a permissions or
  filesystem failure.

Award the final score with the rubric, and discuss any zero in a core dimension
before treating the learner as ready for the next specialization.
