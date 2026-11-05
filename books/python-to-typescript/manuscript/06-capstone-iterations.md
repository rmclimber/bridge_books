# Capstone iterations: change one observable boundary at a time

The first task-ledger chapter established a thin command layer. Now use that
small program as a maintainer would: make a feature change in increments whose
effects a reader can observe. Each increment answers four questions: which
domain value changes, what persisted data must still be accepted, which command
owns input validation, and what test proves the public behavior.

## Increment 1: label without changing a task's state

Labels already belong to the task model, so `label <id> <label>` changes one
task while preserving its ID, title, and state. `list --label <label>` is a
view: it filters after loading and never writes. Repeating a label does not
make two copies. This is a small but important contract: a collection feature
does not justify incidental mutation or a new persistence format.

The acceptance test adds two tasks, labels one twice, filters the view, and
checks that exactly one paused task is rendered. It tests command behavior,
not the private sequence of `Map`, array, or `Set` operations. A Python habit
of reaching for a dictionary is not the design decision here; the existing
readonly label list is the domain contract and the command creates a new list
only when it must change it.

## Trace the change map before touching the switch

An incremental feature can look like one `case` in a command dispatcher while
actually spanning several contracts. Write the map before editing; it tells you
which unchanged parts need regression evidence and which parts need a new
decision.

| Increment | Domain | Persistence | Command and output | Evidence |
| --- | --- | --- | --- | --- |
| Label/filter | Existing `labels` field; no new state | Existing task JSON | `label`, then a query-only `list --label` | Duplicate label and no-write query |
| Pause | New `paused` variant with reason | Accept a non-blank persisted reason | `pause` rejects done work and reports after save | Legacy states, new variant, rejection |
| Report | Every state has a count | No new stored summary | `report` emits one derived line | One task of each kind |
| Failed write | No changed valid task | Preserve old document if the write rejects | No success line | Rejection, empty output, old JSON |

The map prevents two opposite mistakes. The first is under-changing: adding
`paused` to a type but forgetting the parser, renderer, or report. The second
is over-changing: inventing a versioned summary file merely because a report
exists. Both errors happen when an implementation detail, rather than the
observable contract, chooses the work.

For the pause increment, separate *syntax* from *state*. `pause t1` has too
few tokens and fails usage without loading a file. `pause missing Reason` has
valid syntax but fails after loading because no target exists. `pause done-id
Reason` finds a task but violates a transition rule. A blank reason in an
edited JSON file bypasses the command, so it fails at the persistence parser.
These paths have distinct messages and tests because they are distinct facts
about the program.

## Read the acceptance test as a change narrative

The integration test is not a final binary gate. Read it from top to bottom as
the smallest public story of the change:

<!-- snippet: tests/task-ledger.test.ts#capstoneIncrements -->
```ts
test(
  "capstone delivers labels, filtered views, paused work, and a report in increments",
  async () => {
  const capstone = harness();
  await runTaskLedger(["add", "t1", "Draft"], capstone.dependencies);
  await runTaskLedger(["add", "t2", "Review"], capstone.dependencies);
  await runTaskLedger(["label", "t1", "book"], capstone.dependencies);
  await runTaskLedger(["label", "t1", "book"], capstone.dependencies);
  await runTaskLedger(["pause", "t1", "Awaiting", "editor"], capstone.dependencies);

  capstone.lines.length = 0;
  await runTaskLedger(["list", "--label", "book"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["[paused: Awaiting editor] Draft"]);

  capstone.lines.length = 0;
  await runTaskLedger(["report"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["open: 1, paused: 1, done: 0"]);
    await assert.rejects(runTaskLedger(["pause", "t1"], capstone.dependencies), /Usage/);
  },
);
```

The setup deliberately uses the real `TaskStore` over a memory file port. It
therefore exercises serialization, parsing, and command composition without
depending on the host filesystem. Clearing `lines` between commands makes each
assertion about the current user-visible result, not an accidental history of
previous output. The second label call makes idempotence an explicit contract.

Notice what is absent: no assertion counts calls to `filter`, no assertion
requires a particular JSON indentation, and no test reaches into a private
helper. Those are implementation choices. If a later refactor uses a `Set` for
deduplication or extracts the report, the feature still has to tell the same
story. The failed-write test provides the complementary story: when the save
cannot establish the new state, no optimistic output is allowed.

## Use the CLI transcript only after the acceptance story passes

The compiled command is a final integration check, not the fastest feedback
loop. From a disposable task file, run `add`, `label`, `pause`, `list --label`,
and `report`; then inspect the JSON once. A blank ID should fail without
modifying the file. A full-disk or permission failure is harder to reproduce
reliably with a real shell, which is exactly why the deterministic file-port
test owns that case. Keep the two forms of evidence: the test proves edge
behavior; the CLI transcript proves the documented invocation is usable.

## Increment 2: pause is a whole-program union change

A pause reason belongs to a distinct state, not an optional field on every
task. The variant makes a reason mandatory only when it applies:

<!-- snippet: src/task-ledger.ts#pauseCommand -->
```ts
  if (command === "pause" && rest.length >= 2) {
    const [id, ...reasonParts] = rest;
    const reason = reasonParts.join(" ").trim();
    if (id === undefined || id.trim() === "" || reason === "") {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    const task = taskForId(tasks, id);
    if (task.state.kind === "done") {
      throw new RangeError("A completed task cannot be paused: " + id);
    }
    await dependencies.store.save(
      replaceTask(tasks, { ...task, state: { kind: "paused", reason } }),
    );
    dependencies.write("Paused " + id);
    return;
  }
```

The state type, text parser, migration example, summary renderer, command,
and tests all change. TypeScript helps find consumers such as the exhaustive
summary switch. It does not update an old JSON file: JSON reaches the process
as `unknown`, and the persistence boundary must reject a blank reason before
constructing the trusted variant. Version 3 migration accepts the new shape;
the capstone's array parser also continues to accept legacy `open` and `done`
items.

## Increment 3: validate before an effect

An empty ID is syntactically present in `process.argv`, but it is not a usable
domain identifier. `add "" "Title"`, `pause t1`, `label t1 " "`, and a malformed
filter all reject with usage before a save. Validation belongs at the command
boundary because it explains the user-facing grammar. The store still validates
untrusted persisted JSON because a previous program version, a hand edit, or a
different process can bypass the command entirely.

This split is more useful than a blanket rule such as "validate in the model."
Ask which boundary first owns the information. Command tokens need command
validation; parsed JSON needs data validation; a state transition needs domain
validation. Tests should make an invalid command prove that known-good data
was not overwritten.

## Increment 4: a report is a read model, not a second store

The report counts states after loading. It is deliberately small, but it
forces every union variant to be accounted for:

<!-- snippet: src/task-ledger.ts#renderTaskReport -->
```ts
export function renderTaskReport(tasks: readonly Task[]): string {
  const counts = { open: 0, paused: 0, done: 0 };
  for (const task of tasks) {
    counts[task.state.kind] += 1;
  }
  return `open: ${counts.open}, paused: ${counts.paused}, done: ${counts.done}`;
}
```

It takes trusted `Task` values and performs no I/O. That makes the count logic
an ordinary focused unit while the `report` command has a narrow acceptance
test. Do not serialize a second summary document merely to make the report
fast; that creates a consistency problem the scoped application does not need.

## Preserve a useful failure

The command reports success only after `await store.save(...)`. `TaskStore`
translates an unexpected write failure into `TaskStorageError` while keeping
the original error as its cause. The CLI prints the meaningful outer message
and exits unsuccessfully. Neither the command nor the CLI should catch that
failure and announce a recovery it did not perform.

The acceptance test uses a file port whose write rejects. It verifies three
observable facts: the Promise rejects with a storage error, no success line is
written, and the in-memory known-good JSON remains unchanged. This is failure
recovery for this local tool: preserve the last valid state and make the
failure visible. Retrying, journals, and concurrent writers are worthwhile in
other systems but are outside this capstone.

## Maintainer review checklist

- Name the domain, persistence, command, output, and test change before
  editing code.
- Make input syntax, domain invariants, and JSON validation fail at their own
  boundaries.
- Await the effect that makes a success message true.
- Test one normal increment and one failure path through the public command.
- Confirm a new union variant has changed every renderer and report.
- Run `pnpm run check` before using the compiled CLI against a real file.

## Exercises

Complete Exercises 13 and 14 before reading their workbook solutions.
