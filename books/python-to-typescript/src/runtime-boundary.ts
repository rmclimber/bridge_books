/** A checked example of turning untrusted JSON-shaped data into a domain value. */
export type TaskDraft = {
  title: string;
  done: boolean;
};

export type BatchTaskDraft = TaskDraft & { labels: readonly string[] };
export type ValidationIssue = { path: string; message: string };
export type BatchValidation =
  | { ok: true; value: readonly BatchTaskDraft[] }
  | { ok: false; issues: readonly ValidationIssue[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// #region parseTaskDraft
export function parseTaskDraft(value: unknown): TaskDraft {
  if (!isRecord(value)) {
    throw new TypeError("A task draft must be an object.");
  }

  const { title, done } = value;
  if (typeof title !== "string" || title.trim() === "") {
    throw new TypeError("A task draft needs a non-empty string title.");
  }
  if (typeof done !== "boolean") {
    throw new TypeError("A task draft needs a boolean done flag.");
  }

  return { title, done };
}
// #endregion parseTaskDraft

// #region validateTaskBatch
export function validateTaskBatch(value: unknown): BatchValidation {
  if (!isRecord(value) || !Array.isArray(value.tasks)) {
    return { ok: false, issues: [{ path: "tasks", message: "must be an array" }] };
  }
  const issues: ValidationIssue[] = [];
  const tasks: BatchTaskDraft[] = [];
  for (const [index, item] of value.tasks.entries()) {
    const path = `tasks[${index}]`;
    if (!isRecord(item)) {
      issues.push({ path, message: "must be an object" });
      continue;
    }
    const { title, done, labels } = item;
    if (typeof title !== "string" || title.trim() === "") {
      issues.push({ path: `${path}.title`, message: "must be a non-empty string" });
    }
    if (typeof done !== "boolean") {
      issues.push({ path: `${path}.done`, message: "must be boolean" });
    }
    if (!Array.isArray(labels) || !labels.every((label) => typeof label === "string")) {
      issues.push({ path: `${path}.labels`, message: "must be an array of strings" });
    }
    if (
      typeof title === "string" && title.trim() !== "" &&
      typeof done === "boolean" &&
      Array.isArray(labels) && labels.every((label) => typeof label === "string")
    ) {
      tasks.push({ title: title.trim(), done, labels });
    }
  }
  return issues.length === 0 ? { ok: true, value: tasks } : { ok: false, issues };
}
// #endregion validateTaskBatch
