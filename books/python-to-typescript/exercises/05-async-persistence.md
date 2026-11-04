# Exercise 5: Add a checked asynchronous save

`TaskStore.save` returns `Promise<void>`. A command needs to report success
only after the file write finishes:

```ts
async function addTask(
  store: TaskStore,
  tasks: readonly Task[],
  task: Task,
): Promise<string> {
  store.save([...tasks, task]);
  return "Saved";
}
```

1. Repair `addTask` so `"Saved"` is returned only after the write succeeds.
2. Explain what the original function can report incorrectly when `save`
   rejects later.
3. Write a Node test using `assert.rejects` for a `TextFiles` implementation
   whose `write` rejects with an error. What must the test itself return or
   await?
4. A missing file produces `ENOENT`; a directory permission failure produces
   `EACCES`. Which one may `load` convert to `[]`, and why?
