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

class FailingWriteFiles extends MemoryFiles {
  override async write(_path: string, _contents: string): Promise<void> {
    throw Object.assign(new Error("disk full"), { code: "ENOSPC" });
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
  await assert.rejects(runTaskLedger(["add", " ", "Title"], capstone.dependencies), /Usage/);
  await assert.rejects(runTaskLedger(["complete", "missing"], capstone.dependencies), /not found/);

  await runTaskLedger(["add", "t1", "Write", "tests"], capstone.dependencies);
  await assert.rejects(runTaskLedger(["add", "t1", "Duplicate"], capstone.dependencies), /already exists/);
  await assert.rejects(runTaskLedger(["complete", "t1", "extra"], capstone.dependencies), /Usage/);

  const saved = capstone.files.contents.get("tasks.json");
  assert.equal(saved?.includes("Write tests"), true);
  assert.equal(saved?.includes("Duplicate"), false);
});

// #region capstoneIncrements
test(
  "capstone delivers labels, filtered views, paused work, and a report in increments",
  async () => {
  const capstone = harness();
  await runTaskLedger(["add", "t1", "Draft"], capstone.dependencies);
  await runTaskLedger(["add", "t2", "Review"], capstone.dependencies);
  await runTaskLedger(["label", "t1", "book"], capstone.dependencies);
  await runTaskLedger(["label", "t1", "book"], capstone.dependencies);
  await runTaskLedger(["pause", "t1", "Awaiting", "editor"], capstone.dependencies);

  capstone.lines.length = 0;
  await runTaskLedger(["list", "--label", "book"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["[paused: Awaiting editor] Draft"]);

  capstone.lines.length = 0;
  await runTaskLedger(["report"], capstone.dependencies);
  assert.deepEqual(capstone.lines, ["open: 1, paused: 1, done: 0"]);
    await assert.rejects(runTaskLedger(["pause", "t1"], capstone.dependencies), /Usage/);
  },
);
// #endregion capstoneIncrements

test("a failed save never reports success or replaces known-good task data", async () => {
  const files = new FailingWriteFiles();
  files.contents.set(
    "tasks.json",
    JSON.stringify([{ id: "t1", title: "Draft", labels: [], state: { kind: "open" } }]),
  );
  const capstone = harness(files);

  await assert.rejects(runTaskLedger(["pause", "t1", "Blocked"], capstone.dependencies), /Could not write/);
  assert.deepEqual(capstone.lines, []);
  assert.equal(files.contents.get("tasks.json")?.includes("paused"), false);
});
