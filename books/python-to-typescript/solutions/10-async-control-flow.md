# Exercise 9: Explain a concurrent failure and preserve cleanup — solution

## Hint

Separate “the aggregate Promise rejected” from “work that was already started
stopped.” Then trace the `finally` path for both callback outcomes.

## Worked solution

`Promise.all([publish(), audit()])` calls both functions before it
waits for either. It rejects when `publish` rejects, but it cannot
unstart `audit`; a started audit can still finish. Use this form only
when both effects are independent and their concurrent completion is safe. If
the audit must describe a successfully published report, write
`await publish(); await audit();` instead.

```ts
async function useResource<T extends { close(): Promise<void> }, R>(
  resource: T,
  use: (resource: T) => Promise<R>,
): Promise<R> {
  try {
    return await use(resource);
  } finally {
    await resource.close();
  }
}
```

`finally` runs after fulfillment and rejection. Awaiting `close`
means the returned Promise represents both the work and its cleanup.

`ENOENT` on the initial load is normal absence and may return an empty
list. A `SyntaxError` while parsing a stored document is a data failure;
the store should translate it to `TaskDataError`. `EACCES` while
writing is an operational storage failure; it should become
`TaskStorageError`. The latter two classes are distinct because a caller
can offer different recovery advice, while both remain part of the storage
boundary.

```ts
await assert.rejects(publishBoth(publish, audit), /publish failed/);
assert.deepEqual(events, ["publish:start", "audit:start"]);

await assert.rejects(useResource(resource, failingUse), /work failed/);
assert.equal(closeCalls, 1);
```

The test must await each rejection assertion. To prove that audit eventually
finishes after the aggregate rejects, use a controllable Promise in the audit
fixture, release it after `assert.rejects`, then await a turn or the
fixture's completion Promise before asserting its final event.

## Common wrong turns

Do not replace `Promise.all` with sequential awaits merely because one
test rejects; choose the ordering from the data dependency. Do not catch the
aggregate rejection and assume that made the other effect safe. If cancellation
is needed, use an operation designed for it, such as one receiving an
`AbortSignal`, and still define cleanup for work already performed.
