import assert from "node:assert/strict";
import test from "node:test";

import {
  migrateTaskDocument,
  TaskMigrationError,
} from "../src/persistence-migration.js";

const migratedAt = new Date("2026-11-04T12:00:00.000Z");

test("a version 1 document migrates boolean completion into explicit task state", () => {
  const tasks = migrateTaskDocument(
    {
      version: 1,
      tasks: [
        { id: "t1", title: "Draft", labels: ["book"], done: false },
        { id: "t2", title: "Review", labels: [], done: true },
      ],
    },
    migratedAt,
  );

  assert.deepEqual(tasks[0]?.state, { kind: "open" });
  assert.equal(tasks[1]?.state.kind, "done");
  assert.equal(
    tasks[1]?.state.kind === "done" && tasks[1].state.completedAt.toISOString(),
    "2026-11-04T12:00:00.000Z",
  );
});

test("a version 2 document keeps an explicit completion timestamp", () => {
  const tasks = migrateTaskDocument(
    {
      version: 2,
      tasks: [
        {
          id: "t1",
          title: "Draft",
          labels: [],
          state: { kind: "done", completedAt: "2026-11-01T00:00:00.000Z" },
        },
      ],
    },
    migratedAt,
  );

  assert.equal(
    tasks[0]?.state.kind === "done" && tasks[0].state.completedAt.toISOString(),
    "2026-11-01T00:00:00.000Z",
  );
});

test("a version 3 document accepts a paused task only with a usable reason", () => {
  const tasks = migrateTaskDocument(
    {
      version: 3,
      tasks: [
        { id: "t1", title: "Draft", labels: [], state: { kind: "paused", reason: " review " } },
      ],
    },
    migratedAt,
  );

  assert.deepEqual(tasks[0]?.state, { kind: "paused", reason: "review" });
  assert.throws(
    () =>
      migrateTaskDocument(
        { version: 3, tasks: [{ id: "t1", title: "Draft", labels: [], state: { kind: "paused", reason: " " } }] },
        migratedAt,
      ),
    TaskMigrationError,
  );
});

test("an unsupported or malformed persisted document fails loudly", () => {
  assert.throws(
    () => migrateTaskDocument({ version: 4, tasks: [] }, migratedAt),
    TaskMigrationError,
  );
  assert.throws(
    () =>
      migrateTaskDocument(
        { version: 1, tasks: [{ id: "t1", title: "Draft", labels: [], done: "yes" }] },
        migratedAt,
      ),
    TaskMigrationError,
  );
});
