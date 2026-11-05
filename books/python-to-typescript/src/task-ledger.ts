import type { Task } from "./domain-modeling.js";
import { summarizeTasks } from "./domain-modeling.js";
import { TaskStore } from "./task-store.js";

export type TaskLedgerDependencies = {
  store: TaskStore;
  write(line: string): void;
  now(): Date;
};

function usage(): string {
  return [
    "Usage: list [--label <label>] | add <id> <title> | label <id> <label>",
    "pause <id> <reason> | complete <id> | report",
  ].join("\n");
}

function taskForId(tasks: readonly Task[], id: string): Task {
  const task = tasks.find((candidate) => candidate.id === id);
  if (task === undefined) {
    throw new RangeError("Task not found: " + id);
  }
  return task;
}

function replaceTask(tasks: readonly Task[], updated: Task): Task[] {
  return tasks.map((task) => (task.id === updated.id ? updated : task));
}

// #region renderTaskReport
export function renderTaskReport(tasks: readonly Task[]): string {
  const counts = { open: 0, paused: 0, done: 0 };
  for (const task of tasks) {
    counts[task.state.kind] += 1;
  }
  return `open: ${counts.open}, paused: ${counts.paused}, done: ${counts.done}`;
}
// #endregion renderTaskReport

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

  if (command === "list" && rest[0] === "--label" && rest.length === 2) {
    const label = rest[1];
    if (label === undefined || label.trim() === "") {
      throw new RangeError(usage());
    }
    for (const line of summarizeTasks(
      (await dependencies.store.load()).filter((task) => task.labels.includes(label.trim())),
    )) {
      dependencies.write(line);
    }
    return;
  }

  if (command === "add" && rest.length >= 2) {
    const [id, ...titleParts] = rest;
    const title = titleParts.join(" ").trim();
    if (id === undefined || id.trim() === "" || title === "") {
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

  if (command === "label" && rest.length === 2) {
    const [id, label] = rest;
    if (id === undefined || label === undefined || label.trim() === "") {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    const task = taskForId(tasks, id);
    const normalizedLabel = label.trim();
    const labels = task.labels.includes(normalizedLabel)
      ? task.labels
      : [...task.labels, normalizedLabel];
    await dependencies.store.save(replaceTask(tasks, { ...task, labels }));
    dependencies.write(`Labeled ${id} ${normalizedLabel}`);
    return;
  }

  // #region pauseCommand
  if (command === "pause" && rest.length >= 2) {
    const [id, ...reasonParts] = rest;
    const reason = reasonParts.join(" ").trim();
    if (id === undefined || id.trim() === "" || reason === "") {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    const task = taskForId(tasks, id);
    if (task.state.kind === "done") {
      throw new RangeError("A completed task cannot be paused: " + id);
    }
    await dependencies.store.save(
      replaceTask(tasks, { ...task, state: { kind: "paused", reason } }),
    );
    dependencies.write("Paused " + id);
    return;
  }
  // #endregion pauseCommand

  if (command === "complete" && rest.length === 1) {
    const id = rest[0];
    if (id === undefined) {
      throw new RangeError(usage());
    }
    const tasks = await dependencies.store.load();
    const task = taskForId(tasks, id);
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

  if (command === "report" && rest.length === 0) {
    dependencies.write(renderTaskReport(await dependencies.store.load()));
    return;
  }

  throw new RangeError(usage());
}
// #endregion runTaskLedger
