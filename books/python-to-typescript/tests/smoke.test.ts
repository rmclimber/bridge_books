import assert from "node:assert/strict";
import test from "node:test";

import { add } from "../src/smoke.js";

test("the foundation example can be compiled and executed", () => {
  assert.equal(add(20, 22), 42);
});

