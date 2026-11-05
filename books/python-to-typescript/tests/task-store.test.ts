import assert from "node:assert/strict";
import test from "node:test";

import {
  TaskDataError,
  TaskStorageError,
  TaskStore,
  type TextFiles,
} from "../src/task-store.js";

class MemoryFiles implements TextFiles {
  readonly contents = new Map<string, string>();

  async read(path: string): Promise<string> {
    const value = this.contents.get(path);
    if (value === undefined) {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    }
    return value;
  }

  async write(path: string, contents: string): Promise<void> {
    this.contents.set(path, contents);
  }
}

test("an absent task file becomes an empty task list", async () => {
  const store = new TaskStore("tasks.json", new MemoryFiles());
  assert.deepEqual(await store.load(), []);
});

test("save and load await persistence and restore completed dates", async () => {
  const files = new MemoryFiles();
  const store = new TaskStore("tasks.json", files);
  await store.save([
    {
      id: "t1",
      title: "Ship chapter",
      labels: ["book"],
      state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
    },
  ]);

  assert.equal(files.contents.get("tasks.json")?.includes("2026-11-04T00:00:00.000Z"), true);
  const loaded = await store.load();
  assert.equal(loaded[0]?.state.kind, "done");
  assert.equal(
    loaded[0]?.state.kind === "done" && loaded[0].state.completedAt.toISOString(),
    "2026-11-04T00:00:00.000Z",
  );
});

test("malformed data and unexpected I/O failures reject with useful context", async () => {
  const malformed = new MemoryFiles();
  malformed.contents.set("tasks.json", "{not json");
  await assert.rejects(new TaskStore("tasks.json", malformed).load(), TaskDataError);

  const denied: TextFiles = {
    read: async () => {
      throw Object.assign(new Error("denied"), { code: "EACCES" });
    },
    write: async () => {
      throw new Error("denied");
    },
  };
  const store = new TaskStore("tasks.json", denied);
  await assert.rejects(store.load(), /Could not read/);
  await assert.rejects(store.save([]), /Could not write/);
});
