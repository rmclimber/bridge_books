# Exercise 11: Design evidence for a task-listing change

A new behavior should list only the titles of open tasks. The production
function has this boundary:

```ts
interface TaskReader {
  load(): Promise<readonly Task[]>;
}

async function listOpenTaskTitles(reader: TaskReader): Promise<string[]> {
  // implementation omitted
}
```

1. Design a unit test fixture that proves the function excludes a done task
   and awaits exactly one read. Write its expected assertion.
2. Name one behavior that belongs in a `TaskStore` integration test
   instead of the unit test, and explain the boundary.
3. Choose `equal`, `deepEqual`, or `rejects` for each:
   one title, an ordered list of titles, and a failed write. Explain why.
4. A reviewer proposes asserting the number of `filter` calls and the
   exact JSON indentation written by `TaskStore`. Which, if either,
   belongs in the test contract?
5. Give a five-step command sequence for verifying this change from a clean
   checkout, including the lockfile and manuscript artifacts.
