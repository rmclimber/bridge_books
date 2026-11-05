# Exercise 6: Predict the checker — solution

## Lines 1--3

1. TypeScript accepts `retrySummary(fromConfig)`. The variable has every
   required property, and its `strategy` is the literal `"fixed"` because of
   `as const`. The extra `source` property is permitted under structural
   assignability.
2. TypeScript rejects the direct object literal. It has an extra `source`
   property, so the call-site excess-property check catches a likely mistaken
   contract. This check is intentionally stricter for a fresh literal than for
   a variable.
3. TypeScript rejects the call because `"2"` is a string, not the required
   `number`.

None of the accepted code validates JSON. A parser receives `unknown`, checks
the properties at runtime, and returns a fresh `RetrySettings` only after the
checks pass. A type describes the program's intended values; it does not
inspect a file.

## Adding `stale`

After adding the variant, the error appears at:

```ts
return unreachable(status);
```

The switch no longer handles every member of `ImportStatus`. In the `default`
branch, `status` is `{ kind: "stale"; ageDays: number }`, not `never`;
passing it to `unreachable` correctly fails.

Repair the switch by deciding what the new state means:

```ts
case "stale":
  return `Stale: ${status.ageDays} day(s)`;
```

This is a maintenance guarantee inside typed program flow. Imported JSON still
arrives as an unchecked JavaScript value. The runtime boundary must validate
that `kind` is one of the supported strings and that `ageDays` is a suitable
number before the value can be treated as `ImportStatus`.

## Common wrong turns

- Replacing `unreachable(status)` with a broad cast such as
  `unreachable(status as never)` silences the signal and loses the reminder to
  define the new case.
- Removing the direct literal's extra property to appease the checker may hide
  a useful source tag. Put it in a variable when the value really is richer
  than the consumer's small contract, or revise the public contract if every
  caller needs it.
- Treating an assertion as validation confuses compile-time trust with
  JavaScript behavior. Assertions never parse a file or alter a runtime value.
