# Exercise 12: Repair a false-green async test — solution

## Hint

An async operation has not established any result until the Promise representing
it settles. Make that Promise part of both the test and the production flow.

## Worked solution

```ts
test("does not announce a failed save", async () => {
  const lines: string[] = [];
  const store = {
    save: async () => {
      throw new Error("disk full");
    },
  };

  await assert.rejects(addTask(store, task, (line) => lines.push(line)), /disk full/);
  assert.deepEqual(lines, []);
});
```

The original test made the assertion before `addTask`'s Promise had
settled. It could therefore pass before a late success print or rejection. The
repaired test is `async`, awaits the rejection assertion, and observes
the output only after the operation has completed.

```ts
async function addTask(
  store: { save(tasks: readonly Task[]): Promise<void> },
  task: Task,
  write: (line: string) => void,
): Promise<void> {
  await store.save([task]);
  write("Saved");
}
```

Awaiting the write puts the print after the persistence result. A failed save
rejects `addTask`; it never reaches `write`.

Before changing code, read the failing test name, expected value, actual value,
and first relevant stack frame. Those tell you whether the defect is a stale
expectation, output ordering, or a fixture problem. Use
`node --inspect-brk` when a minimal deterministic test and the failure
stack still do not reveal a state transition or emitted-code path. After using
a debugger, keep the focused regression test; remove temporary logging unless
it is intentional production diagnostics.

## Common wrong turns

Do not “fix” this test by adding a timeout. Timeouts make scheduling slower and
less deterministic, but do not connect the assertion to the operation's
Promise. Do not catch the rejection inside `addTask` and return success:
that hides the storage failure and recreates the original false-green path.

## Failure-reading transcript

Suppose a first repair awaits the operation but leaves the success write before
the save:

```text
Expected values to be strictly deep-equal:
+ actual - expected

+ [
+   'Saved'
+ ]
- []
``%BT}

Read this as an output-order failure, not as a request to weaken the
expectation. The test name says no success announcement follows a failed save;
the actual value says the command printed before the Promise settled. The
relevant stack frame should lead to the line containing `write("Saved")`.
Move that line after `await store.save(...)`, then retain both assertions:
the rejection establishes the failure path and the empty output establishes the
user-visible consequence.

If the failure were instead an unhandled rejection after the test completed,
the first question would be whether the test returned or awaited the command's
Promise. These are different diagnoses with different repairs. Let the first
failure's category guide the next edit; do not apply a generic timeout,
additional mock call-count assertion, or a catch-all error handler.
