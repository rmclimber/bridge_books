# Exercise 16: Derive and project a task badge (solution)

## Hint

Read the tag type from the nested state. In the function, construct a new
object with the two fields a badge needs.

## Worked solution

<!-- snippet: solutions/19-derived-api-types.ts#taskBadge -->
```ts
export type TaskBadge = Pick<Task, "title"> & {
  kind: Task["state"]["kind"];
};

export function toTaskBadge(task: Task): TaskBadge {
  return { title: task.title, kind: task.state.kind };
}
```

The tag type follows the task's state union. In the compiler check, assigning
`"waiting"` to `TaskBadge["kind"]` must be an error. At runtime, compare the
whole badge with `{ title: "Draft", kind: "paused" }`. Checking just `kind`
would let a spread of the original task pass even if it exposed extra fields.
Both checks run through [the test file](../tests/derived-api-types.test.ts)
when you run `pnpm run check`.

The `titleOnly` assignment compiles because a `Task` has a `title`. It keeps
the original object, so serializing it still includes the other task fields.
The new object in `toTaskBadge` is what actually limits the output.
