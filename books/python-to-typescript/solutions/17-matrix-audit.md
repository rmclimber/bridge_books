# Matrix audit: explanation, practice, and assessment

This audit lets a learner, reviewer, or maintainer check that every mandatory
claim has explanation, practice, and an independent assessment opportunity.
A chapter name alone is not evidence.

| Competency cluster | Explanation | Practice | Assessment evidence |
| --- | --- | --- | --- |
| Runtime boundary and `unknown` | Runtime-boundary chapter | Parser tests, Exercise 1 | Legacy priority JSON and malformed value |
| Absence and values | Values chapter | Exercise 2 | Missing-priority default choice |
| Unions and shapes | Domain-modeling chapter | Exercise 3 | Literal `Priority`, state preservation |
| Function/mutation contracts | Function-API chapter | Exercise 7 | Copy one task without damaging fields |
| ESM and modules | Structure chapters | Exercises 4 and 8 | Locate parser, command, and store |
| Promises and I/O | Async chapters | Exercises 5, 9, 10 | Failed save has no success output |
| Test/debug workflow | Testing chapter | Exercises 11 and 12 | Learner-authored parser and failure tests |
| Capstone delivery | Capstone iterations | Exercises 13 and 14 | Change map plus priority evidence |

The capstone recurs because each row asks a different question. A task-state
test demonstrates exhaustive handling; a file-port test demonstrates an I/O
boundary; the assessment asks the learner to join the decisions without being
given a patch. This is deliberate reinforcement, not duplicated instruction.

## Review method

Start with claimed behavior. For a persistence change, find the runtime parser
test before trusting a type annotation. For a command, find success and failure
stories. For a union or literal value, find a renderer, report, or exhaustive
consumer. If a test only names an internal helper, ask whether a user-visible
assertion would better protect the behavior.

Then read the explanation. A working patch can still reveal a fragile model
when it says types validate JSON, treats all errors alike, or believes an async
operation is complete merely because it started. The explanation requirement
makes those transfer mistakes visible while the program is inspectable.

## Threshold and self-check

The 9/12 threshold is a floor, not an expert certificate. A zero in
domain/migration, command behavior, or tests means no usable evidence exists
for a required boundary. A reviewer may ask for more evidence above the bar
when a public path is untested.

Before moving on, answer without code: What values can an annotation not make
safe? When should a missing field default rather than reject? What must settle
before success prints? What proves a query is read-only? Which part of a change
belongs to parser, domain policy, command, and integration test? If an answer
is "because the type says so," recreate a small failing example instead of
memorizing syntax.

## Evidence matrix by assessment dimension

The final assessment is intentionally small, but no single test needs to carry
every competency. This map helps a reviewer locate evidence when a submission
is incomplete.

| Assessment demand | Earliest supporting chapter | Evidence the learner should produce | Misconception exposed when absent |
| --- | --- | --- | --- |
| Parse legacy JSON | Runtime boundaries | A missing field becomes a trusted default | "The annotation updates JSON" |
| Constrain priority values | Domain modeling | Literal-union or equivalent runtime parser | "A non-empty string is a domain model" |
| Preserve other fields | Function APIs | Copy/update assertion for state, labels, title | "One field update may mutate anything" |
| Find the correct module | Objects and modules | Change map with parser/store/command locations | "A feature lives in one switch case" |
| Await durability | Async persistence | Success output after resolved write | "Starting an async operation completes it" |
| Explain a rejected write | Testing and debugging | Rejecting port, empty output, old text | "A rejection assertion is enough" |
| Deliver an increment | Capstone iterations | Success, query, and failure stories | "Happy-path output proves a feature" |

Use this table diagnostically. A low score in one rubric row should lead to
the supporting chapter and a small repair exercise, not a vague instruction to
"learn more TypeScript." For example, a learner who defaults every malformed
value needs the runtime-boundary and migration material; a learner who prints
too soon needs Promise order and false-green test repair; a learner who puts
every rule in the CLI needs the module-boundary and command-map material.

## What a clean-checkout review establishes

The final `pnpm run check` demonstrates that the pinned compiler, examples,
snippet extraction, and test suite agree in the current checkout. It does not
prove the learner's explanation, guarantee a real disk will never fail, or
replace code review. It is nevertheless important evidence: it makes the
assessment reproducible and catches a changed source excerpt or a forgotten
consumer of a union change.

For a final self-review, run the check from a clean working tree, read the test
names as a feature index, and open the compiled CLI only after the fast checks
pass. If a result differs from the chapter prediction, reduce it to the
smallest parser, domain, command, or file-port test before changing the design.
That is the professional feedback loop this bridge aims to make habitual.

## Two review conversations

### Conversation one: a passing command with the wrong mental model

A learner submits a green `prioritize` test. The command loads a task, assigns
`task.priority = value`, calls `store.save(tasks)`, and prints success. Their
explanation says, "The task is typed, so JSON is valid after parsing." Do not
begin by debating array mutation. Ask what happens if a user edits the file to
contain `"priority": "urgent"`. If the answer is that TypeScript will catch it,
the missing competency is the runtime boundary. Ask for a malformed-JSON test,
then ask where the parser constructs the trusted priority union.

The mutation may also deserve feedback, but separate concerns. A mutation can
be a valid local implementation choice if the task collection is intentionally
owned and no read-only contract is broken. The assessment's stronger concern is
that a `Task` must be trusted only after validation. Teaching the distinction
keeps a review from becoming a list of stylistic preferences.

### Conversation two: a good parser with false-green output

Another learner writes an excellent parser and a strict literal union. Their
save fake rejects, and their test uses `assert.rejects`. Yet the command writes
`Prioritized t1 high` immediately before awaiting `save`. The test passes if it
never observes output. Ask: "What has the user been told when the disk is
full?" This leads to the Promise model: creating a Promise starts work, but
does not establish the durable result the message claims.

The smallest repair is usually not a retry loop or an error handler. Move the
success output after the awaited save, retain the rejection, and add an empty
output assertion. This conversation links the assessment to the earlier
false-green exercise and gives the learner a repeatable debugging method:
identify the observable contract, await the operation that establishes it, then
make the test observe the contract on both paths.

## Assessment handoff protocol

For a workshop or team review, give learners the assessment, fixture, checklist,
and the documented toolchain only. Ask them to submit: a change map, the code
patch, their tests, `pnpm run check` output, and the required explanation. Do
not give the evaluator guide until they have committed or otherwise recorded a
first attempt.

The reviewer should first reproduce the check, then score evidence rather than
reading implementation from top to bottom. Start with legacy JSON and malformed
JSON, then successful command behavior, then failed persistence and query
non-mutation. Record one strength and one next action in addition to the score.
For example: "You separated missing from malformed priority correctly; add a
failed-write output assertion before using this pattern in another command."

This protocol makes the assessment reusable without turning it into a hidden
interview screen. It tests the bridge's stated outcomes -- safe change,
debugging, and explanation in a small strict-TypeScript repository -- while
making its boundaries explicit to both learner and evaluator.

## Sample evidence log

An effective learner submission can be summarized in a short evidence log:

| Claim | Evidence to attach | What it rules out |
| --- | --- | --- |
| Legacy data stays usable | Parser test loads fixture with normal priorities | A type-only migration |
| New data is constrained | Invalid-present JSON test rejects `urgent` | A broad string or unchecked cast |
| Command is durable | Success line appears after awaited save | Optimistic output |
| Query is safe | Filter test leaves file text unchanged | Hidden write-on-read behavior |
| Failure remains actionable | Rejecting-port test retains cause and empty output | Swallowed disk error |

The log is deliberately compact. It lets a reviewer see whether all boundaries
are represented before reading every line of a patch. It also helps learners
notice an untested claim: if they cannot name an observable assertion for a
row, their design may still be an intention rather than evidence.

For an assessment retake, do not simply add assertions until the number looks
large. Start with the earliest missing row. If malformed JSON is unproved,
write that parser test first and let it reveal the needed code change. If
success output ordering is unproved, write the rejecting-port test first. This
test-first repair keeps the learner focused on a contract rather than the
current implementation's incidental shape.
