# Exercise 2: Preserve meaning

An import function has these bugs:

```ts
type RetryPolicy = { retryLimit?: number | null };

function limitFor(policy: RetryPolicy): number {
  return policy.retryLimit || 3;
}
```

1. Predict its result for `{ retryLimit: 0 }`, `{ retryLimit: null }`, and `{}`.
2. Rewrite it so `0` is retained and only `null` or `undefined` produces `3`.
3. Explain why `taskId === "7"` is safer than `taskId == "7"` when `taskId`
   might be a number or a string.
4. A partner system sends the decimal ID `9007199254740993`. Should the import
   store it as `number`, `bigint`, or `string`? State the condition that makes
   your choice correct.
