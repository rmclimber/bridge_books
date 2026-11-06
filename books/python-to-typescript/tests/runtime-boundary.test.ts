import assert from "node:assert/strict";
import test from "node:test";

import { parseTaskDraft, validateTaskBatch } from "../src/runtime-boundary.js";

test("parseTaskDraft accepts a complete, correctly shaped task", () => {
  const incoming: unknown = JSON.parse('{"title":"Write tests","done":false}');

  assert.deepEqual(parseTaskDraft(incoming), {
    title: "Write tests",
    done: false,
  });
});

test("a batch validator keeps all independent nested issues with stable paths", () => {
  const result = validateTaskBatch({
    tasks: [
      { title: "", done: "no", labels: ["book", 4] },
      null,
      { title: "Valid", done: false, labels: ["testing"] },
    ],
  });
  assert.deepEqual(result, {
    ok: false,
    issues: [
      { path: "tasks[0].title", message: "must be a non-empty string" },
      { path: "tasks[0].done", message: "must be boolean" },
      { path: "tasks[0].labels", message: "must be an array of strings" },
      { path: "tasks[1]", message: "must be an object" },
    ],
  });
});

test("a valid nested batch becomes trusted copied values", () => {
  assert.deepEqual(validateTaskBatch({ tasks: [{ title: "  Draft  ", done: false, labels: ["book"] }] }), {
    ok: true,
    value: [{ title: "Draft", done: false, labels: ["book"] }],
  });
});

test("parseTaskDraft rejects values that only look like task data", () => {
  assert.throws(() => parseTaskDraft(null), /must be an object/);
  assert.throws(() => parseTaskDraft({ title: "Write tests" }), /boolean done flag/);
  assert.throws(() => parseTaskDraft({ title: 42, done: false }), /non-empty string title/);
});
