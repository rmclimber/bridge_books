/** A checked example of turning untrusted JSON-shaped data into a domain value. */
export type TaskDraft = {
  title: string;
  done: boolean;
};

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
