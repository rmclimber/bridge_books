import assert from "node:assert/strict";
import test from "node:test";

import type { TextFiles } from "../src/task-store.js";
import { TaskStore } from "../src/task-store.js";
import { runTaskLedger } from "../src/task-ledger.js";

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

function harness(files = new MemoryFiles()) {
  const lines: string[] = [];
  return {
    files,
    lines,
    dependencies: {
      store: new TaskStore("tasks.json", files),
      write: (line: string) => lines.push(line),
      now: () => new Date("2026-11-04T12:00:00.000Z"),
    },
  };
}

test("capstone accepts add, list, and complete commands end to end", async () => {
  const capstone = harness();
  await runTaskLedger(["add", "t1", "Ship", "the", "book"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["Added t1"]);

  capstone.lines.length = 0;
  await runTaskLedger(["list"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["[open] Ship the book"]);

  capstone.lines.length = 0;
  await runTaskLedger(["complete", "t1"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["Completed t1"]);

  capstone.lines.length = 0;
  await runTaskLedger(["list"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["[done 2026-11-04T12:00:00.000Z] Ship the book"]);
});

test("capstone rejects invalid commands without overwriting task data", async () => {
  const capstone = harness();
  await assert.rejects(runTaskLedger(["add", "t1"], capstone.dependencies), /Usage/);
  await assert.rejects(runTaskLedger(["complete", "missing"], capstone.dependencies), /not found/);

  await runTaskLedger(["add", "t1", "Write", "tests"], capstone.dependencies);
  await assert.rejects(runTaskLedger(["add", "t1", "Duplicate"], capstone.dependencies), /already exists/);
  await assert.rejects(runTaskLedger(["complete", "t1", "extra"], capstone.dependencies), /Usage/);

  const saved = capstone.files.contents.get("tasks.json");
  assert.equal(saved?.includes("Write tests"), true);
  assert.equal(saved?.includes("Duplicate"), false);
});
