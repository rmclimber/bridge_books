import assert from "node:assert/strict";
import test from "node:test";

import type { Task } from "../src/domain-modeling.js";
import { TaskFormatter, openTaskTitles } from "../src/task-presentation.js";

const tasks: readonly Task[] = [
  { id: "t1", title: "Draft chapter", labels: [], state: { kind: "open" } },
  {
    id: "t2",
    title: "Check examples",
    labels: [],
    state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
  },
];

test("a module exports a focused function with a type-only import", () => {
  assert.deepEqual(openTaskTitles(tasks), ["Draft chapter"]);
});

test("a class method needs its receiver when used as a callback", () => {
  const formatter = new TaskFormatter("Task: ");
  assert.deepEqual(formatter.formatAll(tasks), ["Task: Draft chapter", "Task: Check examples"]);

  assert.throws(() => tasks.map(formatter.format), /prefix/);
  assert.deepEqual(tasks.map((task) => formatter.format(task)), [
    "Task: Draft chapter",
    "Task: Check examples",
  ]);
});
