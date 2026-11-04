# Exercise 5: Add a checked asynchronous save --- solution

## Hint

The command cannot know whether persistence succeeded until the Promise from
`save` settles. Make that Promise part of the function's control flow.

## Worked solution

```ts
async function addTask(
  store: TaskStore,
  tasks: readonly Task[],
  task: Task,
): Promise<string> {
  await store.save([...tasks, task]);
  return "Saved";
}
```

The original starts a write, immediately returns `"Saved"`, and leaves a later
rejection detached from the command's claimed result. With `await`, a write
failure rejects `addTask` instead. A CLI can then report failure rather than a
false success.

```ts
await assert.rejects(store.save([]), /Could not write/);
```

The test must be `async` and await that assertion (or return its Promise), so
the runner waits for the rejection check. `ENOENT` is the expected absence of a
first task file and may become `[]`. `EACCES` means the program could not read
an existing location; treating it as no tasks would conceal a permissions
problem and risk overwriting data.
