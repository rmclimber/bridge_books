# Exercise 12: Repair a false-green async test

A teammate wants to prove that a failed save does not print success:

```ts
test("does not announce a failed save", () => {
  const lines: string[] = [];
  const store = {
    save: async () => {
      throw new Error("disk full");
    },
  };

  addTask(store, task, (line) => lines.push(line));
  assert.deepEqual(lines, []);
});
```

The test passes even when a broken `addTask` starts `store.save`,
prints `"Saved"`, and does not await the rejection.

1. Explain why the passing assertion does not prove the intended behavior.
2. Repair the test so Node waits for the failed operation and asserts its
   rejection. Include the assertion that no line was printed.
3. Repair `addTask` so its Promise rejects on the failed save and it
   cannot announce success first.
4. The repaired test now fails with an assertion difference. List the first
   three pieces of failure output you would read before changing the code.
5. When would you use `node --inspect-brk` rather than adding more
   logging, and what must remain after you have found the bug?
