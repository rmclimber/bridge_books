import assert from "node:assert/strict";
import test from "node:test";

import {
  acceptedFromVariable,
  defaultSettings,
  retrySummary,
  summarizeImport,
} from "../src/static-model.js";

test("inferred values remain assignable when their required shape matches", () => {
  assert.equal(defaultSettings.strategy, "backoff");
  assert.equal(retrySummary(defaultSettings), "backoff:3");
  assert.equal(acceptedFromVariable, "fixed:1");
});

test("a discriminated union is handled through its tag", () => {
  assert.equal(summarizeImport({ kind: "ready", count: 2 }), "Ready: 2 record(s)");
  assert.equal(summarizeImport({ kind: "missing" }), "No import file");
});
