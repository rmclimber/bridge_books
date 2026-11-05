import assert from "node:assert/strict";
import test from "node:test";

import type { Task } from "../src/domain-modeling.js";
import { TaskReport } from "../src/task-report.js";
import { selectOpenViews } from "../src/task-views.js";

const tasks: readonly Task[] = [
  { id: "t1", title: "Draft chapter", labels: [], state: { kind: "open" } },
  {
    id: "t2",
    title: "Check examples",
    labels: [],
    state: { kind: "done", completedAt: new Date("2026-11-04T00:00:00.000Z") },
  },
];

test("a query module exposes a structural view without presentation state", () => {
  assert.deepEqual(selectOpenViews(tasks), [
    { id: "t1", title: "Draft chapter", state: "open" },
  ]);
});

test("a report composes the query and keeps its runtime-private prefix", () => {
  const report = new TaskReport("Open task ");

  assert.deepEqual(report.renderOpen(tasks), ["Open task t1: Draft chapter"]);
  assert.equal(Object.getOwnPropertyNames(report).includes("prefix"), false);
  assert.equal(Object.getOwnPropertyNames(report).includes("#prefix"), false);
});
