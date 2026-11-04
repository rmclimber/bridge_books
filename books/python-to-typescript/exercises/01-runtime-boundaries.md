# Exercise 1: Repair the boundary

An import function begins this way:

```ts
type TaskDraft = { title: string; done: boolean };

function importDraft(input: any): TaskDraft {
  return input;
}
```

1. Predict what happens when `input` is `{ title: 7, done: "no" }` and later
   code calls `importDraft(input).title.trim()`.
2. Rewrite `importDraft` so its parameter is `unknown` and it rejects malformed
   values before returning `TaskDraft`.
3. In one or two sentences, explain why replacing `any` with
   `input as TaskDraft` is not a repair.

Run `pnpm run check` after comparing your solution with the workbook.
