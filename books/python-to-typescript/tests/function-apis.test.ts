import assert from "node:assert/strict";
import test from "node:test";

import {
  describeTarget,
  firstItem,
  forEachTitle,
  indexByKey,
  listTitles,
  sortedTitles,
  withAddedLabel,
  type TaskSummary,
} from "../src/function-apis.js";

const tasks: readonly TaskSummary[] = [
  { id: "t1", title: "Draft chapter", labels: ["writing"] },
  { id: "t2", title: "Check examples", labels: ["testing"] },
];

test("an options object distinguishes omitted limits from meaningful zero", () => {
  assert.deepEqual(listTitles(tasks), ["Draft chapter", "Check examples"]);
  assert.deepEqual(listTitles(tasks, { limit: 0 }), []);
  assert.deepEqual(listTitles(tasks, { limit: 1, prefix: "Task: " }), ["Task: Draft chapter"]);
  assert.throws(() => listTitles(tasks, { limit: -1 }), /non-negative/);
});

test("generic callbacks retain each caller's complete item shape", () => {
  const seen: string[] = [];
  forEachTitle(tasks, (task, index) => {
    seen.push(`${index}:${task.id}:${task.labels[0]}`);
  });
  assert.deepEqual(seen, ["0:t1:writing", "1:t2:testing"]);
});

test("a generic immutable update preserves extra caller fields", () => {
  const task = { ...tasks[0]!, owner: "Mina" };
  const updated = withAddedLabel(task, "book");

  assert.equal(updated.owner, "Mina");
  assert.deepEqual(updated.labels, ["writing", "book"]);
  assert.deepEqual(task.labels, ["writing"]);
  assert.notEqual(updated, task);
});

test("sorting a readonly input copies before mutation and keeps callback detail", () => {
  assert.deepEqual(
    sortedTitles(tasks, (task) => `${task.id}:${task.title}`),
    ["t2:Check examples", "t1:Draft chapter"],
  );
  assert.deepEqual(tasks.map((task) => task.id), ["t1", "t2"]);
});

test("a generic key callback creates an explicit Map index", () => {
  const index = indexByKey(tasks, (task) => task.id);
  assert.equal(index.get("t2")?.title, "Check examples");
  assert.throws(() => indexByKey([...tasks, tasks[0]!], (task) => task.id), /Duplicate key: t1/);
});

test("overloads state a correlated result while a union handles one result shape", () => {
  assert.equal(firstItem(["first", "second"] as const), "first");
  assert.equal(firstItem([] as string[]), undefined);
  assert.equal(describeTarget("Inbox"), "Inbox");
  assert.equal(describeTarget(tasks[0]!), "Draft chapter");
});
