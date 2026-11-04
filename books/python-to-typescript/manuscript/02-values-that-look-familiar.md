# Values that look familiar: absence, equality, numbers, and mutation

Python programmers already know that falsey values and mutable containers need
care. JavaScript adds several nearby-but-distinct ideas: a property can be
omitted (`undefined`), deliberately empty (`null`), or present with a falsey
value such as `0` or `""`. Treating all four as interchangeable silently changes
meaning.

## Default only when a value is absent

Suppose `0` means “do not retry.” This common shortcut is wrong:

```ts
const limit = policy.retryLimit || 3;
```

`||` chooses its right side for every falsey left side, including `0`. Use
`??` when the rule is specifically “default only for `null` or `undefined`,” or
spell out the boundary when validating input.

<!-- snippet: src/value-pitfalls.ts#chooseRetryLimit -->
```ts
export function chooseRetryLimit(policy: RetryPolicy): number {
  const candidate = policy.retryLimit;
  if (candidate === null || candidate === undefined) {
    return DEFAULT_RETRY_LIMIT;
  }
  if (!Number.isSafeInteger(candidate) || candidate < 0) {
    throw new RangeError("retryLimit must be a non-negative safe integer.");
  }
  return candidate;
}
```

The complete checked example is
[`src/value-pitfalls.ts`](../src/value-pitfalls.ts). The optional property has
type `number | null | undefined`: omitted properties produce `undefined`, while
the API reserves `null` for an explicit no-value. After those two absence cases,
zero is a valid number and passes through unchanged.

## Equality is not conversion

Use `===` and `!==` by default. Unlike loose equality, they do not convert a
string, number, or boolean merely to make a comparison succeed. Thus `7 ===
"7"` is false, as it should be for task identifiers whose representation carries
meaning. Prefer an explicit conversion at the boundary when comparison across
representations is genuinely required.

Truthiness remains useful for a deliberate boolean question, such as `if
(message)`. It is not a replacement for an absence test when `0`, `false`, or
an empty string are valid values.

## `number` is not Python `int`

JavaScript's ordinary `number` is a floating-point value. It represents every
integer exactly only through `Number.MAX_SAFE_INTEGER` (`9007199254740991`).
Do not parse a large external identifier into a `number` just because its text
contains digits. Keep it as a string when it is opaque, or use `bigint` when you
need integer arithmetic beyond the safe range. A `bigint` is a separate numeric
type: do not mix it with `number` without an explicit conversion.

## Mutation is still an observable choice

Arrays and objects are mutable JavaScript values. `readonly string[]` prevents
an accidental write through that particular TypeScript reference, but it does
not freeze the runtime object. When an operation should preserve its input,
state that choice in both the type and implementation:

```ts
export function withAddedLabel(labels: readonly string[], label: string): string[] {
  return [...labels, label];
}
```

The spread expression creates a new array. This makes callers' state and tests
easier to reason about; use mutation only when it is part of the function's
clear, documented contract.

## Exercises

The next exercise asks you to preserve a meaningful zero, explain strict
equality, and choose a safe representation for an external identifier.
