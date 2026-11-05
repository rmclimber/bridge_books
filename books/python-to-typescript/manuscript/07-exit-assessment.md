# Exit assessment and next steps

The exit assessment asks you to extend the task ledger without a guided code
template. It combines the book's high-risk transfers: a discriminated-union
change, persisted JSON migration, a command that must await I/O, regression
tests, and an explanation of where static types stop.

Complete [`assessments/exit-assessment.md`](../assessments/exit-assessment.md)
in a fresh branch or copy. Do not open the workbook first. The assessment is
deliberately small enough to finish in one focused session, but it is not a
translation drill: you choose the module boundaries, tests, and error behavior.

## What good evidence looks like

A sound submission changes the union and parser together, so existing JSON is
handled deliberately rather than asserted into a new shape. Its `pause` command
loads the current tasks, rejects a completed task, constructs a valid paused
variant, and awaits persistence before it reports success. Its tests prove both
the normal path and the regressions: blank IDs and blank pause reasons must
never arrive in stored task data.

Use the rubric in the assessment file. A score of at least 9 out of 12, with no
zero in domain/migration, async command behavior, or tests, is the target.
Compare your work with the evaluator guide in the separate workbook only after
you have recorded your own explanation.
