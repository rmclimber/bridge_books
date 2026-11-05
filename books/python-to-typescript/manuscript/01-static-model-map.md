# Orientation: the checker, Node, and the shape of a program

Python programmers are already used to a useful distinction: an annotation can
help a tool, while the running interpreter still receives ordinary values.
TypeScript makes the distinction central. The TypeScript checker reads your
source and reports contradictions before JavaScript runs. Node runs the emitted
JavaScript; it does not consult TypeScript types, interfaces, or generic
parameters.

That division is the map for this book:

- use the checker to describe and preserve relationships inside code you
  control;
- use JavaScript runtime checks at files, command lines, environment variables,
  and other inputs you do not control;
- use tests to show that the emitted program actually has the promised
  behavior.

These are complementary protections. A type cannot prove that parsed JSON has a
title, and a runtime `typeof` check cannot make a later refactor preserve every
caller's contract. The next chapter begins at the boundary where values enter.
This chapter first explains the static model available on the safe side of that
boundary.

## Verify the project before changing it

This book targets Node 24 and TypeScript 5.9 in a strict project. From the
book directory, install the locked dependencies with `pnpm install` and run:

```text
pnpm run check
```

That command type-checks the examples, confirms that manuscript excerpts still
match their source files, compiles the examples, and runs the Node tests. It is
the smallest useful “did my change fit this repository?” check. Run a single
command from `package.json` instead of inventing a local compiler invocation:
the script carries the project's `tsconfig`, module mode, and test convention.

When the checker reports an error, read it as a failed statement about possible
values, not as Node refusing to execute a line. When a test fails, inspect the
runtime behavior and fixture. Both failures matter, but they answer different
questions.

## Let inference carry local facts

Python annotations are often read as documentation first. In strict
TypeScript, an annotation is also a constraint on assignment and on every
consumer. Do not annotate every local variable merely because you can. An
initializer often gives the checker a more precise fact than a broad
annotation would.

At an API boundary, however, name the required shape. Here `RetrySettings`
states what `retrySummary` needs. `satisfies` verifies that the default object
meets that shape without changing the useful literal knowledge inferred from
the object.

<!-- snippet: src/static-model.ts#checkedSettings -->
```ts
export const defaultSettings = {
  retries: 3,
  strategy: "backoff",
} satisfies RetrySettings;

export function retrySummary(settings: RetrySettings): string {
  return `${settings.strategy}:${settings.retries}`;
}

const commandLineSettings = {
  retries: 1,
  strategy: "fixed" as const,
  source: "cli",
};

export const acceptedFromVariable = retrySummary(commandLineSettings);

// Object literals are checked for likely misspelled or unwanted fields.
// @ts-expect-error source is not part of RetrySettings.
retrySummary({ retries: 1, strategy: "fixed", source: "cli" });
```

The call with `commandLineSettings` is allowed because the variable has at
least the properties the function requires. Its extra `source` property does
not prevent it from being usable as a `RetrySettings`; this is structural
assignability. The direct object literal is different. TypeScript performs an
extra-property check there because a literal at the call site is often a typo
or a confused API call. This is a helpful diagnostic, not runtime validation:
JavaScript would happily pass either object.

The `as const` on `"fixed"` is intentional. Object-property inference normally
widens a mutable property to `string`; the contract needs the narrower
`"fixed" | "backoff"` union. Use a narrow annotation, a `const` assertion, or
`satisfies` when the distinction represents a real domain choice. Do not use
`as RetrySettings` to silence a mismatch: assertions tell the checker to trust
you and do not change the value.

## Treat assignability as a directional question

Python duck typing asks whether an object can perform the operations a caller
will use. TypeScript has a related static idea: a value is assignable when its
known shape can meet a required type. It is directional. A richer value can
often be passed to a function that asks for a smaller shape; a smaller value
cannot promise fields it lacks.

That explains both examples above and a common review habit. When a diagnostic
mentions assignment, ask: “what shape is required here, and what facts does the
checker know about this value?” Do not begin by asking what class the value
belongs to. Most everyday TypeScript APIs describe object shape rather than
nominal inheritance.

There are deliberate limits. Structural compatibility says nothing about JSON
from disk, class identity at runtime, or an object whose fields are later
mutated through another reference. The right response is not to abandon types;
it is to keep contracts small, validate at entry points, and make mutable
ownership explicit in later chapters.

## Make variant changes fail in one useful place

Unions are not only a way to model alternatives. With a discriminating `kind`
property, they can turn a forgotten case into a compile-time maintenance task.
The helper below accepts only `never`: a type with no possible values. After
the two current cases are handled, `status` has type `never` in the default
branch. If a future edit adds a third variant but does not add a case, that
claim becomes false and the call fails to type-check.

<!-- snippet: src/static-model.ts#summarizeImport -->
```ts
export type ImportStatus =
  | { kind: "ready"; count: number }
  | { kind: "missing" };

function unreachable(value: never): never {
  throw new Error(`Unhandled import status: ${JSON.stringify(value)}`);
}

export function summarizeImport(status: ImportStatus): string {
  switch (status.kind) {
    case "ready":
      return `Ready: ${status.count} record(s)`;
    case "missing":
      return "No import file";
    default:
      return unreachable(status);
  }
}
```

The `default` branch is not expected at runtime for the present union. It is a
tripwire for the next edit. This pattern matters most where a new state affects
formatting, persistence, command behavior, or permissions: precisely the
places where a plausible-looking partial update becomes a production bug.

## A compact working checklist

Before you reach for a type annotation or assertion, ask four questions:

1. Is this a local fact the checker can infer, or a public contract worth
   naming?
2. Is the value produced by code I control, or did it cross a runtime boundary?
3. Is the failure a static mismatch, a missing runtime check, or both?
4. If I add a new variant later, where should the compiler force me to decide
   what it means?

The exercise that follows asks you to predict the checker's answer before
running it. The later chapters use the same questions for function APIs,
collections, modules, asynchronous failures, and the task-ledger capstone.
