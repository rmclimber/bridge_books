import assert from "node:assert/strict";
import test from "node:test";

import { toTaskBadge, type TaskBadge } from "../solutions/19-derived-api-types.js";
import type { Task } from "../src/domain-modeling.js";
import { toTaskView, type TaskView } from "../src/task-views.js";

const task: Task = {
  id: "t1",
  title: "Draft",
  labels: ["book"],
  state: { kind: "paused", reason: "Awaiting review" },
};

// The compiler checks these expressions without running this function.
function checkTypes(summary: Pick<Task, "id" | "title">) {
  // @ts-expect-error The narrow type does not expose labels.
  summary.labels;
  // @ts-expect-error The task view only accepts domain state tags.
  const wrongState: TaskView["state"] = "waiting";
  // @ts-expect-error The badge follows the same domain state tags.
  const wrongKind: TaskBadge["kind"] = "waiting";
}

test("a narrow type leaves the object intact, while a view projects its fields", () => {
  const summary: Pick<Task, "id" | "title"> = task;
  assert.equal(Object.hasOwn(summary, "labels"), true);
  assert.deepEqual(toTaskView(task), { id: "t1", title: "Draft", state: "paused" });
});

test("the worked badge solution returns exactly the title and state tag", () => {
  assert.deepEqual(toTaskBadge(task), { title: "Draft", kind: "paused" });
});
