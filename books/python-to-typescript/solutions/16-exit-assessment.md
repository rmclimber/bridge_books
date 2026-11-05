# Exit assessment: evaluator guide and worked rationale

## Review after independent work

Read the learner's change map, run `pnpm run check`, and inspect the tests
before comparing helper names. The question is whether the submitted
boundaries make the stated behavior reliable, not whether the patch duplicates
one reference solution. The priority task differs from the guided paused-state
increment: it adds a required trusted property while accepting an older JSON
representation that lacks it.

## Reference design in prose

A sound solution uses `type Priority = "low" | "normal" | "high"` and a
required `priority` on `Task`. Trusted consumers never ask whether priority is
present. An optional property would push legacy uncertainty into every
renderer, filter, command, and report.

The JSON parser receives `unknown`. A missing priority is a legacy record, so
construct `priority: "normal"`. A present `"urgent"`, `3`, `null`, or empty
string is malformed current data and rejects as a task-data error. Keep the
existing open/done/paused parsing; priority migration must not weaken it.

`prioritize t1 high` has valid syntax. It loads, finds `t1`, copies only that
task with the new literal, awaits save, and then writes success. A missing or
unknown literal fails usage before an effect. A missing ID is a domain result
after load. `list --priority high` loads and filters but never saves: a query
does not silently rewrite data merely because an in-memory migration default
exists.

## Evidence to look for

| Boundary | Strong evidence | Weak substitute |
| --- | --- | --- |
| Domain | Literal union and required field | `priority: string` or a cast |
| Parser | Missing defaults; present invalid rejects | Default every invalid value |
| Command | Validates, preserves fields, awaits | Prints before a write settles |
| Query | Filters without write | Saves during every list |
| Failure | Rejects, no output, old text remains | Only Promise rejection |

A different decomposition is acceptable. A learner may export a parser helper,
use a literal record, or move filtering to a query module. Score the observable
contract, not a preferred abstraction.

## Read tests in this order

Find a persistence test that starts with the legacy fixture or a literal object.
It should prove absent priority becomes normal after `load`, not only after a
later command saves. Then find a malformed-data test with a *present* invalid
priority. Together these show migration as a two-case policy, not a fallback.

Read the `prioritize` acceptance test next. It should use a deterministic file
port and prove output plus stored data. It should also show title, labels, and
state survive the replacement and unselected tasks remain unchanged. A final
priority assertion alone is incomplete.

Finally, read the failed-save test. A rejecting file port is deterministic.
Require useful storage context, no success line, and unchanged known-good text.
A caught error that returns success or an announcement before an awaited save
earns a lower command-behavior score.

## Scoring examples

### Competent but incomplete -- 8/12

The learner uses a literal union, defaults missing JSON, and tests a successful
command. But `"urgent"` is silently converted to normal, the filtered-list
test is absent, and the explanation says only that TypeScript validates data.
Score 2 in each row. The work is promising but malformed data and a read-only
query remain unproved.

### Green tests with a boundary error -- 7/12

The command accepts any non-empty string and the test uses only `high`. A type
assertion follows `JSON.parse`, so hand-edited data cannot be rejected. Score
domain 1, command 2, tests 2, explanation 2. Ask for a present-invalid JSON
test and a runtime parser before rescoring.

### Meets the bar -- 11/12

The solution uses a narrow parser, defaults only absence, preserves all task
states, validates command literals, awaits success and failure, and proves a
filter does not write. Its explanation connects runtime JSON and output order.
Typical scoring is 3, 3, 3, 2. Naming and factoring preferences do not lower it.

## Common feedback

- "Move legacy uncertainty to parsing, then construct complete trusted tasks."
- "A default is compatibility policy, not suppression of a present error."
- "Output asserts durability; place it after the awaited Promise."
- "A list command should not create a hidden write and recovery obligation."
- "Keep focused fakes, then add one acceptance test through real parsing and
  serialization."

After scoring, ask the learner to narrate one failure: where did the value
enter, which boundary rejected it, and what would a user observe? A mature
answer may identify that this simple load-replace-save design has no concurrent
writer protection. It should not claim TypeScript solves that operational gap.

## Fixture walkthrough: what each legacy record proves

The supplied fixture contains three records because a migration is only
credible when it preserves unrelated valid variation. `legacy-open` proves the
new field does not make an ordinary open task unreadable. `legacy-paused`
proves a new task property composes with the existing discriminated state and
its required reason. `legacy-done` proves the date parser still converts a
persisted string into a usable `Date`. All three omit priority on purpose.

The expected trusted result is not an array of values with optional priority;
it is three complete tasks whose priorities are all normal. A useful review
question is: "After `load`, can any caller see `undefined` priority?" The
reference answer is no. The parser has discharged the compatibility debt. This
is the same reason a parser turns a completed-at JSON string into a `Date`: the
rest of the program should operate on the model it needs, not repeatedly
re-litigate the representation it received.

Now alter one fixture record mentally. If its priority is `"high"`, it should
load as high without changing title, labels, or state. If its priority is
`"urgent"`, no default should apply. That value is evidence of an incompatible
producer or a hand edit and deserves a data error. If its priority is `null`,
an array, or a number, it is likewise malformed. This three-way distinction --
missing, valid-present, invalid-present -- is the core of the assessment.

It is tempting to write `value.priority ?? "normal"` and then assert the
result is `Priority`. That collapses missing and malformed data. It would
silently turn `null` into normal and let a cast hide `"urgent"`. A robust
parser checks whether the key is absent before choosing the compatibility
default, then validates every present value against the literal vocabulary.

## Reference test plan, expressed as behavior

The evaluator does not require exact test code, but the following test stories
should be recognizable in a strong submission.

### 1. Legacy-load story

Seed a memory file with the fixture text. Construct the real `TaskStore` over
that file port and call `load`. Assert that each task has priority normal and
that the paused task retains `reason` while the done task retains its timestamp.
This is an integration test for the parser and serializer boundary. It catches
the common mistake of updating only the TypeScript type and command code.

### 2. Present-invalid-data story

Use JSON with an otherwise valid task and `priority: "urgent"`. `load` should
reject with the same useful data-error family as other malformed task shape.
Do not make the test depend on the full wording of an internal `TypeError`.
The public contract is that external task data is rejected with storage/data
context, preserving the original failure as the cause where the store already
does so.

### 3. Successful-command story

Start from two persisted tasks with distinct state, labels, and title values.
Run the public command `prioritize t1 high`. Assert the output is exactly
`Prioritized t1 high` and inspect the saved or reloaded data. `t1` should have
high priority; its state, title, and labels must be unchanged; `t2` must be
byte-for-byte equivalent in the fake's serialized text or structurally equal
after parsing. That evidence checks copy-on-write discipline without imposing
a particular helper implementation.

### 4. Query story

Record the file port's known-good text. Run `list --priority high` and assert
only high-priority rendered lines appear. Then assert the write count remains
zero, or the stored text remains exactly the original. This is intentionally a
different assertion from the command story: a query can be correct in its
output while still creating a surprising mutation.

### 5. Failure-order story

Give the command a file port that reads known-good text and rejects on write
with a realistic `ENOSPC`-like error. The command Promise should reject with
the task-storage error; the output collection should remain empty; the fake's
contents should still describe the preexisting task. A test that awaits only
`assert.rejects` but never inspects output misses the user-visible guarantee.

## Calibration: distinguish reasonable alternatives

Some design choices are compatible with the rubric. A learner may normalize
priority tokens to lowercase before validation, provided the documented command
contract explains it and tests cover the choice. They may reject priority on a
completed task as a domain policy, or allow it as planning metadata; either is
acceptable when consistent, tested, and explained. They may implement a shared
literal parser, a `Set`, or a `switch`.

Other choices undermine the assessment. Defaulting an invalid present value,
writing on a list query, announcing before save, or exposing optional priority
to every trusted caller are not harmless stylistic differences. They hide the
very runtime, effect-order, and maintenance decisions the assessment measures.

When feedback is needed, request the smallest missing evidence. For a learner
who has a solid parser but no failed-save test, do not ask for a wholesale
rewrite; ask for a rejecting port and three assertions. For a learner who uses
a broad string, ask them to predict behavior for `urgent` and add a test before
choosing the narrow representation. This keeps review proportional and turns a
score into a next learning action.
