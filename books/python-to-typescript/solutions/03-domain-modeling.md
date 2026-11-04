# Exercise 3: Model a paused task — solution

## Hint

Use a literal `kind` in each variant. A field that must exist for one state
belongs in that state's object, not as an optional field shared by all states.

## Worked solution

```ts
type TaskState =
  | { kind: "open" }
  | { kind: "paused"; reason: string }
  | { kind: "done"; completedAt: Date };

function describe(state: TaskState): string {
  switch (state.kind) {
    case "open":
      return "Open";
    case "paused":
      if (state.reason.trim() === "") {
        throw new RangeError("A paused task needs a reason.");
      }
      return `Paused: ${state.reason}`;
    case "done":
      return `Done at ${state.completedAt.toISOString()}`;
  }
}
```

`reason?: string` would allow a paused task with no reason, so every consumer
would need to defend against a state the model should have ruled out. The
union makes `reason` available exactly after the `"paused"` branch is chosen.
The non-empty rule remains a runtime invariant: establish it when constructing
or parsing a task state.

`findById<T extends { id: string }>` needs only an `id` to compare. A
`Reminder` has that shape, so TypeScript infers `T` as `Reminder` and preserves
its `message` field in the return type. That is static structural compatibility,
not a runtime inspection of an unknown value.

Use a `Map<string, Task>` for lookup by ID, a `Set<string>` for distinct labels,
and a `readonly Task[]` for the ordered list. Each choice states its central
semantic property—lookup, uniqueness, or order—rather than treating one
container as a universal dictionary.
