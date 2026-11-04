/** Checked examples for modeling task state with strict TypeScript. */
export type Task = {
  id: string;
  title: string;
  labels: readonly string[];
  state: TaskState;
};

export type TaskState =
  | { kind: "open" }
  | { kind: "done"; completedAt: Date };

export type HasId = { id: string };

// #region summarizeTasks
export function summarizeTasks(tasks: readonly Task[]): string[] {
  return tasks.map((task) => {
    switch (task.state.kind) {
      case "open":
        return `[open] ${task.title}`;
      case "done":
        return `[done ${task.state.completedAt.toISOString()}] ${task.title}`;
    }
  });
}
// #endregion summarizeTasks

export function indexById<T extends HasId>(items: readonly T[]): Map<string, T> {
  const index = new Map<string, T>();
  for (const item of items) {
    if (index.has(item.id)) {
      throw new Error(`Duplicate id: ${item.id}`);
    }
    index.set(item.id, item);
  }
  return index;
}

export function collectLabels(tasks: readonly Task[]): Set<string> {
  const labels = new Set<string>();
  for (const task of tasks) {
    for (const label of task.labels) {
      labels.add(label);
    }
  }
  return labels;
}

export function findById<T extends HasId>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
