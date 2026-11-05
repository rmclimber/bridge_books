# Exercise 10: Migrate a task document without inventing history — solution

## Hint

A JSON document is a runtime value. Establish its outer object and array shape
before trusting a version tag or mapping a task.

## Worked solution

The outer guard has to establish an object with an array:

```ts
if (!isRecord(value) || !Array.isArray(value.tasks)) {
  throw new TaskMigrationError("A task document needs a tasks array.");
}
```

For version 1, validate every field the mapping relies on:

```ts
if (
  !isRecord(value) ||
  typeof value.id !== "string" ||
  typeof value.title !== "string" ||
  typeof value.done !== "boolean"
) {
  throw new TaskMigrationError("A version 1 task is invalid.");
}

return {
  id: value.id,
  title: value.title,
  labels: parseLabels(value.labels),
  state: value.done
    ? { kind: "done", completedAt: migratedAt }
    : { kind: "open" },
};
```

Passing `migratedAt` makes the choice deterministic: tests can assert an
exact timestamp and a reviewer can see the policy at the call site. Calling
`new Date()` inside the migration hides a clock dependency and makes
the migrated file claim a time the old document never recorded.

The version 2 date string still needs runtime validation:

```ts
const completedAt = new Date(value.completedAt);
if (Number.isNaN(completedAt.valueOf())) {
  throw new TaskMigrationError("A version 2 task has an invalid state.");
}
```

A cast changes only TypeScript's static view and cannot turn
`"not-a-date"` into a usable `Date`. `TaskMigrationError`
is appropriate because the file version is known but its contents do not meet
that version's contract.

An honest policy is to record the migration instant as the completed timestamp
and document that it is not the original completion time. Other products might
show “completed before upgrade,” retain a legacy field, or ask the user to
confirm. No TypeScript feature can recover information that version 1 never
persisted.

## Test evidence

Test a v1 open task, a v1 completed task with the injected time, a valid v2
timestamp that remains unchanged, an unsupported version, and an invalid
`done` value. Those fixtures demonstrate both compatibility and the
failure policy; they are stronger evidence than a successful type check.

## Common wrong turns

Do not accept an unversioned array because it resembles the old task list.
Without an explicit version, the migration cannot distinguish a supported
legacy document from a damaged or unrelated JSON file. Fail with a useful
`TaskMigrationError` and make any compatibility policy visible in code
and release notes.

Do not use `as Task[]` after reading JSON. The assertion changes the
checker’s view but does not add the missing state object, reject an invalid
date, or restore a lost completion time. Likewise, do not silently replace a
bad v2 completion date with the migration instant: that mixes malformed current
data with a deliberate legacy-data policy and destroys evidence needed to
repair the file.

Finally, do not run a migration merely because the in-memory TypeScript type
changed. Read the document as `unknown`, validate its outer shape and
version, transform one supported representation at a time, and write the new
version only after the full transformation succeeds. That sequence makes a
failed migration observable instead of partially overwriting a user's data.
