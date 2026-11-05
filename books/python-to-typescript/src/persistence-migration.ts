/** Explicit migration of a small persisted task-document format. */
import type { Task, TaskState } from "./domain-modeling.js";

export class TaskMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskMigrationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLabels(value: unknown): readonly string[] {
  if (!Array.isArray(value) || !value.every((label) => typeof label === "string")) {
    throw new TaskMigrationError("A persisted task needs string labels.");
  }
  return value;
}

function parseState(value: unknown): TaskState {
  if (!isRecord(value)) {
    throw new TaskMigrationError("A version 2 task has an invalid state.");
  }
  if (value.kind === "open") {
    return { kind: "open" };
  }
  if (value.kind === "done" && typeof value.completedAt === "string") {
    const completedAt = new Date(value.completedAt);
    if (!Number.isNaN(completedAt.valueOf())) {
      return { kind: "done", completedAt };
    }
  }
  if (
    value.kind === "paused" &&
    typeof value.reason === "string" &&
    value.reason.trim() !== ""
  ) {
    return { kind: "paused", reason: value.reason.trim() };
  }
  throw new TaskMigrationError("A version 2 task has an invalid state.");
}

function taskFromV2(value: unknown): Task {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string") {
    throw new TaskMigrationError("A version 2 task needs an id and title.");
  }
  return {
    id: value.id,
    title: value.title,
    labels: parseLabels(value.labels),
    state: parseState(value.state),
  };
}

// #region migrateTaskDocument
export function migrateTaskDocument(value: unknown, migratedAt: Date): Task[] {
  if (!isRecord(value) || !Array.isArray(value.tasks)) {
    throw new TaskMigrationError("A task document needs a tasks array.");
  }

  if (value.version === 2 || value.version === 3) {
    return value.tasks.map(taskFromV2);
  }

  if (value.version === 1) {
    return value.tasks.map((value) => {
      if (
        !isRecord(value) ||
        typeof value.id !== "string" ||
        typeof value.title !== "string" ||
        typeof value.done !== "boolean"
      ) {
        throw new TaskMigrationError("A version 1 task is invalid.");
      }
      return {
        id: value.id,
        title: value.title,
        labels: parseLabels(value.labels),
        state: value.done ? { kind: "done", completedAt: migratedAt } : { kind: "open" },
      };
    });
  }

  throw new TaskMigrationError("Unsupported task document version.");
}
// #endregion migrateTaskDocument
