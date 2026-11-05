# Promises, asynchronous persistence, errors, and tests

Python's `await` resumes a coroutine; TypeScript's `await` unwraps a
`Promise`. The practical rule is the same: an operation that needs a result
from I/O must await it. In Node, filesystem work can fail after the function
has returned its Promise, so the error path belongs in that asynchronous flow.

## Await the operation that establishes the result

Do not treat a Promise as its eventual value. A task store makes that visible:
`load` returns `Promise<Task[]>`, so a caller needs `await store.load()` before
it can inspect tasks. Make the `await` part of the `try` block when the failure
is expected to be handled there.

<!-- snippet: src/task-store.ts#loadTasks -->
```ts
  async load(): Promise<Task[]> {
    let text: string;
    try {
      text = await this.files.read(this.path);
    } catch (error) {
      if (isMissingFile(error)) {
        return [];
      }
      throw new TaskStorageError("Could not read the task file.", { cause: error });
    }

    try {
      return parseTasks(JSON.parse(text) as unknown);
    } catch (error) {
      throw new TaskDataError("The task file is not valid task data.", { cause: error });
    }
  }
```

`await` does not make I/O synchronous; it pauses this async function and gives
Node a chance to run other work. The returned Promise settles only after the
read and parse complete. Calling `this.files.read(this.path)` without `await`
would leave `text` as a Promise, not file content.

## Translate expected failures; preserve unexpected causes

A missing task file is an expected first-run condition, so this store returns
an empty list only for `ENOENT`. A permissions failure (`EACCES`) must not look
like an empty list. The store adds a stable, domain-relevant `TaskStorageError`
and keeps the original error as `cause` for logs and debugging.

Malformed JSON and bad persisted shapes are also failures at the runtime
boundary. The static `Task` type does not turn JSON date strings back into
`Date` objects. `parseTasks` checks each field, validates a completion date,
and constructs the trusted domain value. This is the same boundary discipline
as Chapter 1, now inside an asynchronous workflow.

## Test Promises by awaiting or rejecting them

Node's test runner treats an `async` test as complete only after its returned
Promise settles. Write `await assert.rejects(...)` for a failing operation;
otherwise a test can finish before the assertion runs. The checked tests use
an injected in-memory `TextFiles` port, so they verify persistence behavior
without timing-sensitive real filesystem fixtures.

`save` awaits the write and lets callers decide when persistence is complete.
Its tests cover a round trip, a missing file, malformed JSON, and an unexpected
I/O error. Do not catch every error and return a default: that hides data loss
and turns a diagnosable failure into a misleading result.

## Exercises

The next exercise asks you to make an async task operation observable and
testable without a framework.
