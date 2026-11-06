/** Query-shaped views that sit between the task model and presentation. */
import type { Task } from "./domain-modeling.js";

// #region taskView
export type TaskView = Pick<Task, "id" | "title"> & {
  state: Task["state"]["kind"];
};

export function toTaskView(task: Task): TaskView {
  return { id: task.id, title: task.title, state: task.state.kind };
}
// #endregion taskView

// #region selectOpenViews
export function selectOpenViews(tasks: readonly Task[]): TaskView[] {
  return tasks
    .filter((task) => task.state.kind === "open")
    .map(toTaskView);
}
// #endregion selectOpenViews
