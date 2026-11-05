/** A small seam used to distinguish unit and integration tests. */
import type { Task } from "./domain-modeling.js";

export interface TaskReader {
  load(): Promise<readonly Task[]>;
}

// #region listOpenTaskTitles
export async function listOpenTaskTitles(reader: TaskReader): Promise<string[]> {
  const tasks = await reader.load();
  return tasks
    .filter((task) => task.state.kind === "open")
    .map((task) => task.title);
}
// #endregion listOpenTaskTitles
