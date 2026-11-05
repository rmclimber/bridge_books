/** Query-shaped views that sit between the task model and presentation. */
import type { Task } from "./domain-modeling.js";

// #region selectOpenViews
export type TaskView = {
  id: string;
  title: string;
  state: Task["state"]["kind"];
};

export function toTaskView(task: Task): TaskView {
  return { id: task.id, title: task.title, state: task.state.kind };
}

export function selectOpenViews(tasks: readonly Task[]): TaskView[] {
  return tasks
    .filter((task) => task.state.kind === "open")
    .map(toTaskView);
}
// #endregion selectOpenViews
