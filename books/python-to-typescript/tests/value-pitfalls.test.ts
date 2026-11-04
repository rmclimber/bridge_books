import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_RETRY_LIMIT,
  chooseRetryLimit,
  hasSameTaskId,
  parseOpaqueId,
  withAddedLabel,
} from "../src/value-pitfalls.js";

test("chooseRetryLimit keeps zero but defaults only null and undefined", () => {
  assert.equal(chooseRetryLimit({ retryLimit: 0 }), 0);
  assert.equal(chooseRetryLimit({ retryLimit: null }), DEFAULT_RETRY_LIMIT);
  assert.equal(chooseRetryLimit({}), DEFAULT_RETRY_LIMIT);
  assert.throws(() => chooseRetryLimit({ retryLimit: 1.5 }), /safe integer/);
});

test("strict equality does not coerce task identifiers", () => {
  assert.equal(hasSameTaskId(7, 7), true);
  assert.equal(hasSameTaskId(7, "7"), false);
});

test("opaque IDs retain digits that a number would round", () => {
  assert.equal(parseOpaqueId("9007199254740993"), 9007199254740993n);
  assert.throws(() => parseOpaqueId("task-7"), /decimal digits/);
});

test("withAddedLabel leaves the caller's array unchanged", () => {
  const original = ["inbox"];
  assert.deepEqual(withAddedLabel(original, "urgent"), ["inbox", "urgent"]);
  assert.deepEqual(original, ["inbox"]);
});
