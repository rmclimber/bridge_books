# Capstone: task ledger

The capstone is a framework-free typed local task-tracking CLI. Its command
layer composes the checked domain model, presentation functions, and
asynchronous persistence modules.

It is currently a capstone seed. The planned expansion adds labels/filtering,
paused-state migration, validation hardening, persistence-failure recovery,
and a report command as separate, acceptance-tested increments. See
`../EXPANSION_PLAN.md`.

## Commands

After `pnpm run build:examples`, run:

```powershell
$env:TASK_LEDGER_FILE = ".\\tasks.json"
node dist/src/task-ledger-cli.js add t1 "Ship the book"
node dist/src/task-ledger-cli.js list
node dist/src/task-ledger-cli.js complete t1
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
- Duplicate IDs, missing tasks, malformed commands, malformed JSON, and
  unexpected I/O failures reject with useful errors; failed commands do not
  overwrite valid task data.
- `pnpm run check` validates the integration tests as well as the chapter
  examples.

