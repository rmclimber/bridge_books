import assert from "node:assert/strict";
import test from "node:test";

import { parseTaskDraft } from "../src/runtime-boundary.js";

test("parseTaskDraft accepts a complete, correctly shaped task", () => {
  const incoming: unknown = JSON.parse('{"title":"Write tests","done":false}');

  assert.deepEqual(parseTaskDraft(incoming), {
    title: "Write tests",
    done: false,
  });
});

test("parseTaskDraft rejects values that only look like task data", () => {
  assert.throws(() => parseTaskDraft(null), /must be an object/);
  assert.throws(() => parseTaskDraft({ title: "Write tests" }), /boolean done flag/);
  assert.throws(() => parseTaskDraft({ title: 42, done: false }), /non-empty string title/);
});
