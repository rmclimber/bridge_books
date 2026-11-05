# Testing, debugging, and maintainable change

Tests are not the last ritual after a TypeScript change. They are the evidence
that separates three claims which the compiler cannot combine: this code has
the intended static relationships, this JavaScript does the intended work, and
this change still fits the repository's operational contract.

Python's test habits transfer well: name behavior, arrange a small fixture,
assert a meaningful outcome, and keep tests independent. The TypeScript and
Node workflow adds a few high-value distinctions: the compiler does not run
tests, async tests must await their evidence, dependency seams can be structural
rather than inheritance-based, and project scripts and the lockfile are part
of a reproducible change.

## Choose the smallest boundary that can fail

A unit test exercises one decision while replacing external effects with a
small fake. An integration test composes real project modules across an
important boundary, such as serialization through `TaskStore`. Neither
is “better”; they answer different questions.

`listOpenTaskTitles` needs only a thing that can load tasks. Its
`TaskReader` interface is deliberately smaller than `TaskStore`,
so a test can supply one focused fake without a mock framework:

<!-- snippet: src/task-listing.ts#listOpenTaskTitles -->
```ts
export async function listOpenTaskTitles(reader: TaskReader): Promise<string[]> {
  const tasks = await reader.load();
  return tasks
    .filter((task) => task.state.kind === "open")
    .map((task) => task.title);
}
```

The unit test supplies known open and done tasks, calls this function, and
asserts the one open title plus a single `load` call. It does *not*
retest JSON parsing, date restoration, or the filesystem port. That narrowness
makes a failure point to the listing decision.

The integration test uses a real `TaskStore` but an in-memory
`TextFiles` implementation. It saves tasks, loads them through the
store, and then lists titles. That test covers the useful seam between domain
objects, JSON serialization, parsing, and the consumer without relying on a
machine-specific temporary file. The capstone tests use the same style at a
larger boundary: command arguments, store behavior, clock, and observable
output.

Prefer a fake when you control the interface and need a simple, behaviorally
honest replacement. A fake should have the same useful contract, not merely
return values that make the test pass. Avoid an elaborate mock that duplicates
the implementation's internal call sequence; then a harmless refactor breaks
the test while user-visible behavior remains correct.

## Assert the contract, not an accident

The strongest assertion is usually the smallest one that demonstrates the
behavior at the boundary:

```ts
assert.deepEqual(await listOpenTaskTitles(reader), ["Draft chapter"]);
await assert.rejects(store.save([]), /Could not write/);
assert.equal(loaded[0]?.state.kind, "done");
```

Use `equal` for one scalar fact, `deepEqual` for a value-shaped
result, and `rejects` for an async failure the caller must handle.
Avoid asserting an entire error stack, generated JSON whitespace, a private
field, or an incidental number of helper calls unless that detail is part of
the public contract. Over-specified tests become friction rather than
protection.

An async test is complete only after its returned Promise settles. In Node's
test runner, mark the test `async` and await both the operation and
`assert.rejects`. A test that calls an async function without awaiting
it can pass while its assertion or rejection runs later. The compiler may
correctly type-check that test; only the runtime test proves the scheduling and
error behavior.

## Read a failure before changing code

When a test fails, preserve the first useful signal. Start with the test name,
expected value, actual value, and stack location. Then classify the failure:

| Signal | First question |
| --- | --- |
| TypeScript diagnostic | Does the static contract or import path contradict the change? |
| Assertion difference | Which observable output differs from the stated behavior? |
| Rejected Promise | Did the test await it, and what is the original `cause`? |
| `ERR_MODULE_NOT_FOUND` | Does emitted JavaScript have the exact ESM specifier Node loads? |
| Flaky ordering | Did the test accidentally assume scheduling or use a real clock? |

Do not change an assertion simply because it is red. A failing test may expose
an intended behavior change, a defect, a stale fixture, or an assumption the
test never had authority to make. State which one it is before editing. This
is especially important after changing a persisted document: a fixture may be
the old version on purpose, and silently updating it can erase migration
coverage.

Use one failing test as a debugging boundary. Reduce the input to the smallest
fixture that still fails, trace the value entering the boundary, and add a
regression assertion for the discovered case. Do not add production logging
only to make a test readable when a narrow fake or an asserted intermediate
result would make the behavior directly observable.

## Debug emitted code when the type checker is not enough

`pnpm run typecheck` checks TypeScript source without emitting JavaScript.
`pnpm test` compiles then runs the emitted Node tests. That order
matters: a green type check cannot prove that a relative ESM import resolves,
that `Date` restoration happens, or that an awaited write reaches its
file port.

This project emits source maps. When a failure needs a debugger rather than a
smaller fixture, build first and run a compiled entry point with Node's
inspector:

```powershell
pnpm run build:examples
node --inspect-brk dist/src/task-ledger-cli.js list
```

Attach a debugger to the displayed Node address, set a breakpoint in the
TypeScript source, and inspect the emitted call only after reproducing the
failure with a focused command or test. Breakpoints are an optional tool, not
a substitute for an assertion: use them to discover a cause, then encode the
regression in a deterministic test.

## Make project scripts the shared interface

Run the repository's scripts rather than composing ad hoc commands:

```text
pnpm run typecheck
pnpm run verify:snippets
pnpm test
pnpm run check
```

`typecheck` is fast feedback on strict static contracts.
`verify:snippets` ensures marked book excerpts still equal their
executable source. `test` emits and executes the Node suite. `check`
combines all three and is the required pre-review gate. A useful change
description names the script run and the behavior it covered, not merely
“tests passed.”

`package.json` names the intended commands; `pnpm-lock.yaml`
records the exact dependency graph used to validate them. Keep the lockfile in
a normal code change when dependency resolution legitimately changes. Do not
regenerate it to hide an unrelated diff, and do not delete it to make a local
install easier: a clean checkout needs the same toolchain evidence as your
machine.

## A clean-change checklist

Before handing off a TypeScript change:

1. Locate the public behavior, its domain type, runtime boundary, and nearest
   existing test before writing code.
2. Add or revise the narrowest test that would fail for the original bug.
3. Use a fake for a local decision and an integration test for a real module
   boundary; avoid duplicating the same assertion at both levels.
4. Run `pnpm run check`; read the first failure rather than fixing
   diagnostics in arbitrary order.
5. Review the diff for accidental generated files, lockfile churn, stale
   snippets, and test fixtures that no longer express the intended scenario.
6. From a clean checkout, install with the locked dependencies, run
   `pnpm run check`, then build the manuscript artifacts.

The last step is a release-confidence check, not something required after
every two-line edit. It catches undocumented machine state, missing files, and
commands that only work after a previous local build.

## Exercises

The next exercise designs a small test boundary; the following one repairs a
plausible async test that gives a false green result.
