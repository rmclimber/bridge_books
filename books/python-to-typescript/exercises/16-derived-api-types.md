# Exercise 16: Derive and project a task badge

A badge needs the task's `title` and the state tag under a field named `kind`.
It should carry exactly those two fields.

1. Derive `TaskBadge` from `Task` using `Pick` for `title` and an indexed access
   type for `kind`. Implement `toTaskBadge(task: Task): TaskBadge`.
2. Add a compiler check showing that `"waiting"` cannot be a badge kind.
   Add a runtime assertion that a paused task with labels and a reason produces
   exactly `{ title: "Draft", kind: "paused" }`.
3. Predict whether `const titleOnly: Pick<Task, "title"> = task` compiles and
   whether serializing `titleOnly` would omit the task's other fields. Explain
   the difference between that assignment and your badge function.

Run `pnpm run check` after comparing your answer with the workbook.
