import { readFile, writeFile } from "node:fs/promises";

import type { Task, TaskState } from "./domain-modeling.js";

export interface TextFiles {
  read(path: string): Promise<string>;
  write(path: string, contents: string): Promise<void>;
}

export const nodeTextFiles: TextFiles = {
  read: (path) => readFile(path, "utf8"),
  write: (path, contents) => writeFile(path, contents, "utf8"),
};

export class TaskStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TaskStorageError";
  }
}

export class TaskDataError extends TaskStorageError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TaskDataError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseState(value: unknown): TaskState {
  if (!isRecord(value) || typeof value.kind !== "string") {
    throw new TypeError("A task state needs a kind.");
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
  throw new TypeError("A task state is invalid.");
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    throw new TypeError("The task file must contain an array.");
  }
  return value.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      !Array.isArray(item.labels) ||
      !item.labels.every((label) => typeof label === "string")
    ) {
      throw new TypeError("A persisted task is invalid.");
    }
    return { id: item.id, title: item.title, labels: item.labels, state: parseState(item.state) };
  });
}

function isMissingFile(error: unknown): boolean {
  return isRecord(error) && error.code === "ENOENT";
}

export class TaskStore {
  constructor(
    private readonly path: string,
    private readonly files: TextFiles = nodeTextFiles,
  ) {}

  // #region loadTasks
  async load(): Promise<Task[]> {
    let text: string;
    try {
      text = await this.files.read(this.path);
    } catch (error) {
      if (isMissingFile(error)) {
        return [];
      }
      throw new TaskStorageError("Could not read the task file.", { cause: error });
    }

    try {
      return parseTasks(JSON.parse(text) as unknown);
    } catch (error) {
      throw new TaskDataError("The task file is not valid task data.", { cause: error });
    }
  }
  // #endregion loadTasks

  async save(tasks: readonly Task[]): Promise<void> {
    try {
      await this.files.write(this.path, JSON.stringify(tasks, null, 2));
    } catch (error) {
      throw new TaskStorageError("Could not write the task file.", { cause: error });
    }
  }
}
