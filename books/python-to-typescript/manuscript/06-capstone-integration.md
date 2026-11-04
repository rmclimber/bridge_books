# Capstone integration: the task ledger

The capstone is a small local task ledger, not a framework application. It is
the point where the earlier chapters must work together: the command layer
awaits persistence, persistence validates JSON at its boundary, and the domain
model makes a completed task a distinct state.

## Keep the command layer thin

`runTaskLedger` accepts argument tokens plus its dependencies. The CLI file
provides the real Node adapters; the integration test provides an in-memory
file port and a fixed clock. This is structural typing used as a practical test
seam, not a mock framework.

<!-- snippet: src/task-ledger.ts#runTaskLedger -->
```ts
export async function runTaskLedger(
  args: readonly string[],
  dependencies: TaskLedgerDependencies,
): Promise<void> {
  const [command, ...rest] = args;
  if (command === "list" && rest.length === 0) {
    for (const line of summarizeTasks(await dependencies.store.load())) {
      dependencies.write(line);
    }
    return;
  }

  if (command === "add" && rest.length >= 2) {
    const [id, ...titleParts] = rest;
    const title = titleParts.join(" ").trim();
    if (id === undefined || title === "") {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    if (tasks.some((task) => task.id === id)) {
      throw new RangeError("Task already exists: " + id);
    }
    const task: Task = { id, title, labels: [], state: { kind: "open" } };
    await dependencies.store.save([...tasks, task]);
    dependencies.write("Added " + id);
    return;
  }

  if (command === "complete" && rest.length === 1) {
    const id = rest[0];
    if (id === undefined) {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    const task = tasks.find((candidate) => candidate.id === id);
    if (task === undefined) {
      throw new RangeError("Task not found: " + id);
    }
    if (task.state.kind === "done") {
      throw new RangeError("Task is already complete: " + id);
    }
    await dependencies.store.save(
      tasks.map((candidate) =>
        candidate.id === id
          ? { ...candidate, state: { kind: "done", completedAt: dependencies.now() } }
          : candidate,
      ),
    );
    dependencies.write("Completed " + id);
    return;
  }

  throw new RangeError(usage());
}
```

Each mutating command loads the current collection, constructs a new trusted
`Task`, and awaits `save` before reporting success. The command layer
does not parse persisted JSON, format task states, or silently translate a
write failure. Those responsibilities remain in their narrow modules.

To run the capstone, first use `pnpm run build:examples`, then run the compiled CLI. Set
`TASK_LEDGER_FILE` to choose a JSON file; otherwise it uses `tasks.json`
in the current directory.

```powershell
$env:TASK_LEDGER_FILE = ".\\tasks.json"
node dist/src/task-ledger-cli.js add t1 "Ship the book"
node dist/src/task-ledger-cli.js list
node dist/src/task-ledger-cli.js complete t1
```

The integration test is the acceptance evidence: it adds a task, lists its open
state, completes it at a fixed instant, then lists the persisted done state.
It also proves invalid commands and duplicate IDs reject without overwriting
valid data. That is enough for this capstone's language and workflow goals;
interactive prompts, concurrent writers, framework UI, and database storage
remain intentionally out of scope.
