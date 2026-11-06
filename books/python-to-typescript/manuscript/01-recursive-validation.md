# Recursive validation: paths, policy, and several useful failures

The first parser stops at the first bad field because it protects one small
boundary. Imports are different: a user who supplies a batch benefits from
knowing every independent defect in one pass. Do not solve that by declaring
incoming JSON to be an array of typed tasks. Start with `unknown`, traverse its
actual runtime shape, and choose an error policy deliberately.

## Fail fast and aggregate answer different questions

Fail-fast parsing is appropriate when later work is unsafe or meaningless
without the first fact. A command cannot find a task until its task file is an
array. Aggregate validation is appropriate when independent fields can be
checked safely and the caller can correct them together. An import form with a
bad title, boolean, and label list should not require three upload attempts.

The result is therefore a discriminated union, not an exception for every
expected malformed field. `ok: true` carries trusted values; `ok: false`
carries stable paths and messages. Callers must narrow on `ok` before using a
batch, just as they narrowed `unknown` before reading a property.

## Traverse values; build trusted replacements

<!-- snippet: src/runtime-boundary.ts#validateTaskBatch -->
```ts
export function validateTaskBatch(value: unknown): BatchValidation {
  if (!isRecord(value) || !Array.isArray(value.tasks)) {
    return { ok: false, issues: [{ path: "tasks", message: "must be an array" }] };
  }
  const issues: ValidationIssue[] = [];
  const tasks: BatchTaskDraft[] = [];
  for (const [index, item] of value.tasks.entries()) {
    const path = `tasks[${index}]`;
    if (!isRecord(item)) {
      issues.push({ path, message: "must be an object" });
      continue;
    }
    const { title, done, labels } = item;
    if (typeof title !== "string" || title.trim() === "") {
      issues.push({ path: `${path}.title`, message: "must be a non-empty string" });
    }
    if (typeof done !== "boolean") {
      issues.push({ path: `${path}.done`, message: "must be boolean" });
    }
    if (!Array.isArray(labels) || !labels.every((label) => typeof label === "string")) {
      issues.push({ path: `${path}.labels`, message: "must be an array of strings" });
    }
    if (
      typeof title === "string" && title.trim() !== "" &&
      typeof done === "boolean" &&
      Array.isArray(labels) && labels.every((label) => typeof label === "string")
    ) {
      tasks.push({ title: title.trim(), done, labels });
    }
  }
  return issues.length === 0 ? { ok: true, value: tasks } : { ok: false, issues };
}
```

The loop performs two jobs. It appends each independently knowable problem to
`issues`, and it constructs a new trusted task only when every required fact
holds. A partially valid input does not become a partially trusted batch. That
policy prevents a caller from accidentally importing only the good records
while reporting errors that look nonfatal.

## Paths are part of the boundary contract

`tasks[0].labels` is more useful than "invalid task" because a human and a
machine can locate the problem. Paths are not a schema language or a promise of
perfect localization; they are stable identifiers for this small format. Keep
them based on the external representation, not internal variable names.

Messages explain the violated rule. A UI could format them differently later,
but tests should compare paths and concise rule text rather than a stack trace.
If a file itself cannot be read or parsed as JSON, use the storage/data error
taxonomy from the persistence chapter. Aggregate issues are for a readable
value whose nested fields are independently malformed.

## Keep the validator specific

It is tempting to abstract this loop into a generic validation framework. Do
not do that yet. The reader needs to see `unknown`, records, arrays, narrowing,
and the domain replacement together. A schema library can be a good later
choice, but it moves those decisions behind API calls. First be able to explain
which boundary owns a default, an error path, and a trusted result.

## Exercises

Complete Exercise 15, then compare your path policy and aggregation decision
with the workbook solution.
