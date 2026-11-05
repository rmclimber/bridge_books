import assert from "node:assert/strict";
import test from "node:test";

import type { Task } from "../src/domain-modeling.js";
import { listOpenTaskTitles, type TaskReader } from "../src/task-listing.js";
import { TaskStore, type TextFiles } from "../src/task-store.js";

const tasks: readonly Task[] = [
  { id: "t1", title: "Draft chapter", labels: [], state: { kind: "open" } },
  {
    id: "t2",
    title: "Review examples",
    labels: [],
    state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
  },
];

test("a unit test uses a narrow fake to test listing decisions", async () => {
  let loadCalls = 0;
  const reader: TaskReader = {
    async load(): Promise<readonly Task[]> {
      loadCalls += 1;
      return tasks;
    },
  };

  assert.deepEqual(await listOpenTaskTitles(reader), ["Draft chapter"]);
  assert.equal(loadCalls, 1);
});

test("an integration test uses TaskStore serialization through an in-memory file port", async () => {
  const contents = new Map<string, string>();
  const files: TextFiles = {
    async read(path): Promise<string> {
      const value = contents.get(path);
      if (value === undefined) {
        throw Object.assign(new Error("missing"), { code: "ENOENT" });
      }
      return value;
    },
    async write(path, text): Promise<void> {
      contents.set(path, text);
    },
  };
  const store = new TaskStore("tasks.json", files);
  await store.save(tasks);

  assert.deepEqual(await listOpenTaskTitles(store), ["Draft chapter"]);
});
