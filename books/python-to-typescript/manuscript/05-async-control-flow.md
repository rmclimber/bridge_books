# Async control flow, failures, and changing persisted data

Python's `await` makes a coroutine pause at a useful point. JavaScript's
`await` makes an async function pause until a `Promise` settles.
That resemblance is helpful, but it can hide the decisions that matter in Node:
when does work begin, which effects must happen in order, what does
`Promise.all` do after one branch fails, and which failures are normal
enough to handle rather than report?

Treat an async operation as an observable lifecycle:

1. Calling an async function creates a Promise and may start work up to its
   first `await`.
2. Each `await` yields this function; it does not block Node's whole
   process.
3. The Promise later fulfills with a value or rejects with a reason.
4. Callers choose whether to await, return, aggregate, translate, or let that
   outcome reach a top-level boundary.

The lifecycle is why a return type such as `Promise<Task[]>` is part of
the contract, not boilerplate. It says the list is unavailable now and that a
caller must make a decision about success and failure.

## Sequence dependent effects; aggregate independent effects

Python code often writes two awaits in source order, and that remains the right
choice when the second step depends on the first: create a directory, then
write a file; load a task list, then update it; close a resource after using
it. Sequential awaits make that dependency visible.

For independent effects, start both and aggregate their outcomes. The checked
helpers make the difference explicit:

<!-- snippet: src/async-control-flow.ts#runSequentially -->
```ts
export async function runSequentially<T>(
  steps: readonly AsyncStep<T>[],
): Promise<T[]> {
  const results: T[] = [];
  for (const step of steps) {
    results.push(await step());
  }
  return results;
}

export function runTogether<T>(steps: readonly AsyncStep<T>[]): Promise<T[]> {
  return Promise.all(steps.map((step) => step()));
}
```

`runSequentially` does not call the next function until the preceding
Promise settles. `runTogether` calls every function synchronously while
building the array, so each operation reaches its first `await` before
the aggregate Promise is returned. `Promise.all` fulfills its result
array in input order, not completion order. That makes the return value
predictable even if the network request named second finishes first.

Do not use `Promise.all` as a synonym for “make it faster.” It is
appropriate only when the effects have no required order and are safe to have
in flight together. Two read-only file loads may be independent; two
read-modify-write operations on the same task file are not. Starting the latter
together can lose an update even when both Promises fulfill.

## Rejection is not cancellation

A common Python-to-TypeScript overgeneralization is “the first error stops the
other work.” `Promise.all` rejects when one input rejects, but it does
not cancel the other Promises. If a second write, timer, or request was already
started, it can still complete after the aggregate has rejected. The
`async-control-flow` tests prove this with controllable Promise steps:
both steps record that they started; the first rejects; the second is then
allowed to finish.

That behavior has two design consequences. First, do validation before
starting irreversible effects where possible. Second, if an operation needs
real cancellation, use an API that accepts an `AbortSignal` and define
what cleanup or compensation means. Neither a type annotation nor
`Promise.all` rolls back external work automatically. For this book's
file-store scope, prefer simple sequential writes and make a recovery policy
explicit at the command boundary.

## Cleanup belongs in `finally`

An error path is not a reason to skip resource cleanup. The same `finally`
model familiar from Python applies to an async function; await the cleanup so
the returned Promise does not settle before it completes.

<!-- snippet: src/async-control-flow.ts#useResource -->
```ts
export async function useResource<TResource extends AsyncClosable, TResult>(
  resource: TResource,
  use: (resource: TResource) => Promise<TResult>,
): Promise<TResult> {
  try {
    return await use(resource);
  } finally {
    await resource.close();
  }
}
```

The `return await` is intentional here. It lets `finally` run
after the callback's Promise settles, whether it fulfills or rejects. The
tests show `close` after both a successful callback and one that throws.
If cleanup itself can fail, decide which failure should be primary and preserve
the other as context; silently swallowing either makes debugging harder.

This helper is a small, framework-free version of a resource-management rule:
the code that acquires a resource should make its release visible. The store
does not currently open a long-lived handle, but the same rule applies to
temporary directories, streams, locks, and future network clients.

## Give failure classes a job

Do not catch an `unknown` error merely to attach a vague string.
Classify it at the layer that understands the operation:

- `ENOENT` while loading the initial task file is expected absence, so
  `TaskStore.load` returns an empty list.
- `EACCES`, an unreadable device, or a write failure is an operational
  storage problem. `TaskStorageError` adds a stable task-storage
  message and preserves the original error as `cause`.
- Malformed JSON or an impossible persisted shape is a data problem.
  `TaskDataError` subclasses `TaskStorageError`, allowing a
  caller to report a repairable data issue differently while retaining a
  common storage boundary.

This is an error taxonomy, not a hierarchy for its own sake. Use a distinct
class only when a caller, test, log, or recovery path can make a meaningful
choice from it. The tests assert `TaskDataError` for malformed content
and `TaskStorageError` behavior for failed reads and writes. They do
not convert every exception into an empty task list.

At the command-line edge, show a short domain message and log or expose the
`cause` according to the application's diagnostics policy. Do not
display an internal filesystem path or raw stack trace to an untrusted user by
default; do not discard it before a maintainer can investigate.

## Persistence is a versioned contract

Types describe the in-memory program. A JSON file outlives a TypeScript build,
so changing `Task` may require a migration. Consider an earlier document:

```json
{ "version": 1, "tasks": [{ "id": "t1", "title": "Draft", "labels": [], "done": true }] }
```

Version 2 uses the domain's discriminated `state` instead. The migration
is an explicit runtime function with an injected date, rather than an
assertion that an old boolean somehow already has a completion timestamp.

<!-- snippet: src/persistence-migration.ts#migrateTaskDocument -->
```ts
export function migrateTaskDocument(value: unknown, migratedAt: Date): Task[] {
  if (!isRecord(value) || !Array.isArray(value.tasks)) {
    throw new TaskMigrationError("A task document needs a tasks array.");
  }

  if (value.version === 2) {
    return value.tasks.map(taskFromV2);
  }

  if (value.version === 1) {
    return value.tasks.map((value) => {
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
        state: value.done ? { kind: "done", completedAt: migratedAt } : { kind: "open" },
      };
    });
  }

  throw new TaskMigrationError("Unsupported task document version.");
}
```

The migration chooses a documented policy: a v1 completed task receives the
provided migration instant because v1 never stored its actual completion time.
Another product might label this as unknown, ask a user, or retain a legacy
field. There is no type-system trick that recovers information the old format
never saved. Injecting `migratedAt` makes the policy deterministic in
tests and avoids a hidden clock dependency.

## Debug an async failure from the boundary inward

When an async test fails, do not start by adding `await` everywhere.
Use this order:

1. Identify the Promise that represents the result the caller claims to have.
2. Find where each external effect starts and whether source order is a real
   dependency.
3. Check whether an aggregation failure left other effects running.
4. Follow the original `cause` behind any domain error.
5. Inspect persisted JSON as `unknown`; locate its version before
   treating it as the current model.

This workflow separates scheduling bugs, I/O failures, and format migrations.
It also makes the tests meaningful: an order test should control settlement
order, an error test should assert rejection and its class, and a migration
test should name both the old document and the target behavior.

## Exercises

The next two exercises ask you to classify a concurrent failure and write a
deliberate persisted-data migration.
