/** Stateful presentation composed from task-view queries. */
import type { Task } from "./domain-modeling.js";
import { selectOpenViews } from "./task-views.js";
import type { TaskView } from "./task-views.js";

// #region renderOpenReport
export class TaskReport {
  #prefix: string;

  constructor(prefix: string) {
    this.#prefix = prefix;
  }

  render(view: TaskView): string {
    return `${this.#prefix}${view.id}: ${view.title}`;
  }

  renderOpen(tasks: readonly Task[]): string[] {
    return selectOpenViews(tasks).map((view) => this.render(view));
  }
}
// #endregion renderOpenReport
