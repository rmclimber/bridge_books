import { TaskStore } from "./task-store.js";
import { runTaskLedger } from "./task-ledger.js";

const path = process.env.TASK_LEDGER_FILE ?? "tasks.json";

try {
  await runTaskLedger(process.argv.slice(2), {
    store: new TaskStore(path),
    write: (line) => console.log(line),
    now: () => new Date(),
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : "Task ledger failed.");
  process.exitCode = 1;
}
