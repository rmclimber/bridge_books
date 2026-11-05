# Exercise 11: Design evidence for a task-listing change — solution

## Hint

Ask which decision belongs to the listing function and which belongs to
persistence. A good fake is only as large as the contract the unit needs.

## Worked solution

```ts
let loadCalls = 0;
const reader: TaskReader = {
  async load() {
    loadCalls += 1;
    return [
      { id: "t1", title: "Draft", labels: [], state: { kind: "open" } },
      {
        id: "t2",
        title: "Review",
        labels: [],
        state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
      },
    ];
  },
};

assert.deepEqual(await listOpenTaskTitles(reader), ["Draft"]);
assert.equal(loadCalls, 1);
```

The fake returns a known domain value, so this is a unit test of filtering and
title projection. JSON date restoration, malformed-file rejection, and
serialization belong in a `TaskStore` integration test because those
behaviors cross the persistence boundary.

Use `assert.equal` for one title or one call count,
`assert.deepEqual` for the ordered title array, and
`await assert.rejects(...)` for a failed write. The `filter`
call count is an implementation detail; a refactor to a loop should not break
the test. JSON indentation belongs only if an external file-format contract
explicitly promises it, which this book's task store does not.

A clean-checkout verification path is:

1. Clone or reset to a clean worktree with `package.json` and
   `pnpm-lock.yaml`.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm run check`.
4. Run `./scripts/build.ps1`.
5. Run `./scripts/build-workbook.ps1` and inspect the artifacts.

## Common wrong turns

Do not call a broad fake `TaskStore` if the unit needs only
`load`; that needlessly couples the test to write behavior. Do not
replace the integration test with a real disk fixture by default: an in-memory
`TextFiles` port still exercises the store's serialization and parsing
without machine-specific cleanup.
