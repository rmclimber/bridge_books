import type { Task } from "../src/domain-modeling.js";

// #region taskBadge
export type TaskBadge = Pick<Task, "title"> & {
  kind: Task["state"]["kind"];
};

export function toTaskBadge(task: Task): TaskBadge {
  return { title: task.title, kind: task.state.kind };
}
// #endregion taskBadge
