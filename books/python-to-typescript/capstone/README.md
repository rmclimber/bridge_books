# Capstone: task ledger

The capstone is a framework-free typed local task-tracking CLI. Its command
layer composes the checked domain model, presentation functions, and
asynchronous persistence modules.

It evolves through acceptance-tested increments: labels and filtered views,
paused-state compatibility, command validation, persistence-failure recovery,
and a report command. See `../manuscript/06-capstone-iterations.md`.

## Commands

After `pnpm run build:examples`, run:

```powershell
$env:TASK_LEDGER_FILE = ".\\tasks.json"
node dist/src/task-ledger-cli.js add t1 "Ship the book"
node dist/src/task-ledger-cli.js list
node dist/src/task-ledger-cli.js complete t1
node dist/src/task-ledger-cli.js label t1 book
node dist/src/task-ledger-cli.js list --label book
node dist/src/task-ledger-cli.js report
```

The file variable is optional; the default is `tasks.json` in the current
directory.

## Acceptance criteria

- An absent task file behaves as an empty list.
- `add <id> <title>` persists an open task and reports its ID.
- `list` renders open and completed states through the checked presentation
  function.
- `complete <id>` persists a completion timestamp and reports success only
  after writing.
- `label <id> <label>` adds a distinct label, while `list --label <label>`
  filters a view without changing persistence.
- `pause <id> <reason>` persists a non-empty reason, and `report` counts all
  states.
- Duplicate IDs, missing tasks, malformed commands, malformed JSON, and
  unexpected I/O failures reject with useful errors; failed commands do not
  overwrite valid task data.
- `pnpm run check` validates the integration tests as well as the chapter
  examples.

