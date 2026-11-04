import type { Task } from "./domain-modeling.js";
import { summarizeTasks } from "./domain-modeling.js";
import { TaskStore } from "./task-store.js";

export type TaskLedgerDependencies = {
  store: TaskStore;
  write(line: string): void;
  now(): Date;
};

function usage(): string {
  return "Usage: list | add <id> <title> | complete <id>";
}

// #region runTaskLedger
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
// #endregion runTaskLedger
