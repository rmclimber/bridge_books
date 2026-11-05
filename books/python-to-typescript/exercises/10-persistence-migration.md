# Exercise 10: Migrate a task document without inventing history

Version 1 of a task file used a boolean:

```json
{
  "version": 1,
  "tasks": [
    { "id": "t1", "title": "Draft", "labels": ["book"], "done": true }
  ]
}
```

Version 2 uses the current domain state:

```ts
type TaskState =
  | { kind: "open" }
  | { kind: "done"; completedAt: Date };
```

1. Write the outer checks that keep an `unknown` document from being
   treated as a task array before you inspect `version` and `tasks`.
2. Write the v1 mapping for one task. It must reject a missing or non-boolean
   `done`; use an injected `migratedAt: Date` for a completed task.
3. Explain why using `new Date()` inside the migration makes tests and
   policy less clear.
4. A version 2 document supplies
   `{ kind: "done", completedAt: "not-a-date" }`. Should a cast accept
   it? State the runtime check and the error class you would use.
5. Name a policy for the lost historical completion time that is honest to the
   user. Why can TypeScript not recover it?
