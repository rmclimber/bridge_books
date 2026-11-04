# Exercise 2: Preserve meaning — solution

## Hint

Separate an absent value from a falsey value. Then decide whether the external
identifier is an arithmetic quantity or an opaque label.

## Worked solution

```ts
type RetryPolicy = { retryLimit?: number | null };

function limitFor(policy: RetryPolicy): number {
  return policy.retryLimit ?? 3;
}
```

The original returns `3` for all three inputs because `0`, `null`, and
`undefined` are falsey. The repaired version returns `0`, `3`, and `3` in that
order: `??` recognizes only `null` and `undefined` as absent.

Strict equality does not quietly convert values, so a number `7` and string
`"7"` remain different identifiers unless code explicitly normalizes them.
Store the large value as a `string` when it is an opaque external label; use a
`bigint` only when the program must perform integer arithmetic on it. A
`number` cannot represent that value exactly.
