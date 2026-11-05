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

Each mutating command loads the current collection, constructs a new trusted
`Task`, and awaits `save` before reporting success. The command layer
does not parse persisted JSON, format task states, or silently translate a
write failure. Those responsibilities remain in their narrow modules. The
complete checked dispatcher is in [`src/task-ledger.ts`](../src/task-ledger.ts);
the next chapter evolves it in small reviewed increments.

To run the capstone, first use `pnpm run build:examples`, then run the compiled CLI. Set
`TASK_LEDGER_FILE` to choose a JSON file; otherwise it uses `tasks.json`
in the current directory.

```powershell
$env:TASK_LEDGER_FILE = ".\\tasks.json"
node dist/src/task-ledger-cli.js add t1 "Ship the book"
node dist/src/task-ledger-cli.js list
node dist/src/task-ledger-cli.js complete t1
node dist/src/task-ledger-cli.js label t1 book
node dist/src/task-ledger-cli.js report
```

The integration test is the first acceptance evidence: it adds a task, lists
its open state, completes it at a fixed instant, then lists the persisted done
state. The iteration chapter adds labels, paused work, reporting, and failed
write coverage. That is enough for this capstone's language and workflow goals;
interactive prompts, concurrent writers, framework UI, and database storage
remain intentionally out of scope.
