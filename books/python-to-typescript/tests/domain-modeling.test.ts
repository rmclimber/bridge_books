import assert from "node:assert/strict";
import test from "node:test";

import {
  collectLabels,
  findById,
  indexById,
  summarizeTasks,
  type Task,
} from "../src/domain-modeling.js";

const tasks: readonly Task[] = [
  { id: "t1", title: "Draft chapter", labels: ["book", "writing"], state: { kind: "open" } },
  {
    id: "t2",
    title: "Check examples",
    labels: ["book", "testing"],
    state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
  },
  {
    id: "t3",
    title: "Wait for review",
    labels: ["book"],
    state: { kind: "paused", reason: "Awaiting editor" },
  },
];

test("a discriminated union narrows task state exhaustively", () => {
  assert.deepEqual(summarizeTasks(tasks), [
    "[open] Draft chapter",
    "[done 2026-11-04T00:00:00.000Z] Check examples",
    "[paused: Awaiting editor] Wait for review",
  ]);
});

test("Map indexes unique IDs and Set removes repeated labels", () => {
  assert.equal(indexById(tasks).get("t2")?.title, "Check examples");
  assert.deepEqual([...collectLabels(tasks)].sort(), ["book", "testing", "writing"]);
  assert.throws(() => indexById([tasks[0]!, { ...tasks[0]!, title: "Duplicate" }]), /Duplicate id/);
});

test("generic structural constraints accept another value with an id", () => {
  const notes = [{ id: "n1", body: "Review the union." }];
  assert.deepEqual(findById(notes, "n1"), notes[0]);
  assert.equal(findById(notes, "missing"), undefined);
});
