# Exercise 9: Explain a concurrent failure and preserve cleanup

This helper is intended to publish a report and record an audit event:

```ts
async function publishBoth(
  publish: () => Promise<void>,
  audit: () => Promise<void>,
): Promise<void> {
  await Promise.all([publish(), audit()]);
}
```

In a test, `publish` rejects after both functions have recorded
`"started"`. The test expects `audit` not to finish, but it does.

1. Explain why the expectation is wrong. What does `Promise.all` reject
   for, and what does it not do?
2. State one condition under which `Promise.all` is appropriate here,
   and one condition under which the two operations should instead be
   sequential.
3. Write a `useResource`-style helper signature and body that awaits
   `resource.close()` after both a successful and a rejecting callback.
4. A file read rejects with an error carrying `code: "ENOENT"`; a
   malformed JSON document throws `SyntaxError`; a write rejects with
   `EACCES`. Assign each outcome to normal absence, data failure, or
   operational storage failure. Which two should become distinct error classes?
5. Write one Node assertion for the rejected publish and one assertion that
   cleanup ran. Make clear what must be awaited by the test.
