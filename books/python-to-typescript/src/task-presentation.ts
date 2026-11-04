/** Module-level functions and a class that formats trusted task-domain values. */
// #region openTaskTitles
import type { Task } from "./domain-modeling.js";

export function openTaskTitles(tasks: readonly Task[]): string[] {
  return tasks
    .filter((task) => task.state.kind === "open")
    .map((task) => task.title);
}
// #endregion openTaskTitles

export class TaskFormatter {
  constructor(private readonly prefix: string) {}

  // #region formatTasks
  format(task: Task): string {
    return `${this.prefix}${task.title}`;
  }

  formatAll(tasks: readonly Task[]): string[] {
    return tasks.map((task) => this.format(task));
  }
  // #endregion formatTasks
}
