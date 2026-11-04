# Exercise 3: Model a paused task

The task state currently has two variants:

```ts
type TaskState =
  | { kind: "open" }
  | { kind: "done"; completedAt: Date };
```

Add a paused variant that must include a non-empty `reason` string.

1. Write the new union and update a `describe(state: TaskState): string`
   function so it handles every variant.
2. Explain why `{ kind: "paused", reason?: string }` weakens the domain model.
3. Given `type Reminder = { id: string; message: string }`, explain why a
   generic `findById<T extends { id: string }>` can return a `Reminder` without
   knowing about `Task`.
4. Choose `Map`, `Set`, or an array for (a) tasks by ID, (b) all distinct
   labels, and (c) the user's ordered task list; justify each choice.

