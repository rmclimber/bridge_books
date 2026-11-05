import assert from "node:assert/strict";
import test from "node:test";

import {
  runSequentially,
  runTogether,
  useResource,
  type AsyncStep,
} from "../src/async-control-flow.js";

test("sequential steps do not begin the next effect until the prior one settles", async () => {
  const events: string[] = [];
  const steps: readonly AsyncStep<string>[] = [
    async () => {
      events.push("first:start");
      await Promise.resolve();
      events.push("first:end");
      return "first";
    },
    async () => {
      events.push("second:start");
      return "second";
    },
  ];

  assert.deepEqual(await runSequentially(steps), ["first", "second"]);
  assert.deepEqual(events, ["first:start", "first:end", "second:start"]);
});

test("Promise.all starts independent effects together and preserves input result order", async () => {
  const events: string[] = [];
  const first: AsyncStep<string> = async () => {
    events.push("first:start");
    await Promise.resolve();
    events.push("first:end");
    return "first";
  };
  const second: AsyncStep<string> = async () => {
    events.push("second:start");
    return "second";
  };

  assert.deepEqual(await runTogether([first, second]), ["first", "second"]);
  assert.deepEqual(events, ["first:start", "second:start", "first:end"]);
});

test("Promise.all rejects for a failing effect without cancelling an already-started effect", async () => {
  let finishSecond: (() => void) | undefined;
  const secondFinished = new Promise<void>((resolve) => {
    finishSecond = resolve;
  });
  const events: string[] = [];

  await assert.rejects(
    runTogether([
      async () => {
        events.push("first:start");
        throw new Error("first failed");
      },
      async () => {
        events.push("second:start");
        await secondFinished;
        events.push("second:end");
        return "second";
      },
    ]),
    /first failed/,
  );
  assert.deepEqual(events, ["first:start", "second:start"]);

  finishSecond?.();
  await Promise.resolve();
  assert.deepEqual(events, ["first:start", "second:start", "second:end"]);
});

test("async cleanup runs after success and after a rejected use operation", async () => {
  const events: string[] = [];
  const resource = {
    async close(): Promise<void> {
      events.push("close");
    },
  };

  assert.equal(
    await useResource(resource, async () => {
      events.push("use");
      return "result";
    }),
    "result",
  );
  await assert.rejects(
    useResource(resource, async () => {
      events.push("fail");
      throw new Error("work failed");
    }),
    /work failed/,
  );
  assert.deepEqual(events, ["use", "close", "fail", "close"]);
});
