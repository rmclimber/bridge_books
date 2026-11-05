# Function APIs: contracts for calls, absence, and change

Python functions often communicate their contract through parameter names,
defaults, documentation, and tests. Strict TypeScript puts more of that
contract where callers can see it: parameter types, return types, callback
signatures, and unions describe what a call may supply and what it may receive.
The aim is not to annotate every local expression. It is to make the boundary
between a function and its callers hard to misunderstand.

For a library or command-line program, a function signature is a small public
API. A good signature answers practical questions before code runs: can this
argument be omitted, does zero mean something different from absence, may the
function mutate my array, and what information will a callback receive?

## Infer inside; declare at the call boundary

TypeScript infers local facts from a declared function signature. Name a type
at a boundary when it is part of the promise to a caller. A compact object type
is often clearer than a row of related optional parameters: it gives options
names, makes later extension non-breaking, and does not force callers to
remember argument order.

<!-- snippet: src/function-apis.ts#listTitles -->
```ts
export function listTitles(
  tasks: readonly Titled[],
  options: ListOptions = {},
): string[] {
  const limit = options.limit ?? tasks.length;
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative safe integer.");
  }

  const prefix = options.prefix ?? "";
  return tasks.slice(0, limit).map((task) => `${prefix}${task.title}`);
}
```

The options parameter may be omitted because its default is an empty object.
Within the function, the limit property has type number or undefined: the
property is optional, so an omitted property produces undefined. The
nullish-coalescing operator means “use the default only for null or
undefined.” It deliberately preserves zero, which means “return no titles” in
this API. Python's or shortcut and JavaScript's double-pipe operator would
incorrectly treat zero as absence.

Default parameters also run when a caller explicitly passes undefined. That is
useful for simple optional configuration. It is not runtime validation:
negative limits must still be rejected because types are erased before Node
runs. Validate values from JSON, a CLI, or another untrusted boundary before
constructing an options object.

## Optional is a contract, not a convenience marker

These three shapes mean different things:

```ts
function a(limit?: number): void {}
function b(limit: number | undefined): void {}
function c(limit: number = 20): void {}
```

Callers may omit the argument to a and c; they must supply an argument to b,
though it may be undefined. Inside a and b, the value is number or undefined.
Inside c, the default has already run, so the value is number. Choose the form
that tells the truth about the call protocol. If omitting a value is meaningful,
say so with an optional parameter or a default; do not use a false numeric
sentinel merely to avoid an optional type.

An options object is not automatically better. Use separate positional
parameters when they form a short, stable phrase such as a collection and an
ID. Use an object when several values are independently optional, named, or
likely to grow. Avoid an object whose every field is optional if the function
really needs one of several mutually exclusive modes; a union models that
decision more honestly.

## Type callbacks by what they receive

In Python, a callback may be accepted as a broad Callable or left implicit.
That hides useful facts. A callback type can describe the exact item, index,
result, and error channel available to the function. Generic parameters
preserve the caller's richer item type instead of reducing every item to a base
shape.

```ts
export function forEachTitle<T extends Titled>(
  items: readonly T[],
  visit: (item: T, index: number) => void,
): void {
  items.forEach((item, index) => visit(item, index));
}
```

The constraint says this helper needs a title. The type parameter says it must
return each caller's actual item to the callback. Passing a task-summary array
gives the callback access to ID and labels as well as title; passing notes with
title and body would preserve body. This is generic preservation applied to a
function argument rather than a return value.

Keep callback contracts narrow. A callback that needs only an item should not
receive a mutable collection, hidden state, or any. A readonly array input
makes the no-mutation promise visible. It does not freeze the runtime array,
but it prevents this function from sorting or assigning through its own
reference. Tests can then confirm the behavioral part of the promise.

## Preserve an item while making a deliberate copy

Some functions build a new version of a record rather than changing the
caller's record. The following generic is more useful than returning a plain
task summary: a caller's extra fields survive the operation.

<!-- snippet: src/function-apis.ts#withAddedLabel -->
```ts
export function withAddedLabel<T extends TaskSummary>(task: T, label: string): T {
  if (label.trim() === "") {
    throw new RangeError("label must not be blank.");
  }

  return { ...task, labels: [...task.labels, label] };
}
```

The spread expressions create a new outer object and labels array. Readonly
expresses that this function will not write through the labels reference;
copying makes the stronger runtime behavior observable to a caller. The
generic preserves fields such as owner without making the function know that
every task has an owner. This is a good default for small transformations.
When a function intentionally mutates an object, expose that decision in its
name, documentation, type, and tests rather than letting callers discover it.

## Use unions by default; use overloads for correlated results

A union is usually the simplest way to accept alternatives when the result has
one stable shape:

```ts
function describeTarget(target: string | Titled): string {
  return typeof target === "string" ? target : target.title;
}
```

The implementation narrows the union just as it narrows a domain state. Do not
write two overload signatures merely because there are two branches if both
branches return the same kind of value.

Overloads earn their complexity when an input choice changes the result type.
First-item promises an item for a statically non-empty tuple and an item or
undefined for an ordinary array:

```ts
function firstItem<T>(items: readonly [T, ...T[]]): T;
function firstItem<T>(items: readonly T[]): T | undefined;
function firstItem<T>(items: readonly T[]): T | undefined {
  return items[0];
}
```

The implementation signature must safely cover every overload. Ask two
questions: do callers need a result type correlated with the input, and can the
implementation reliably identify the input case? If either answer is no,
prefer a union or separate, plainly named functions.

## Copy before an operation that mutates

Python has a useful split between the in-place list sort method and the
non-mutating sorted function. JavaScript arrays have an in-place sort method;
strict TypeScript can prevent an accidental write through a readonly parameter,
but it cannot make sort non-mutating. Copy at the operation that needs
ownership, then make the copy visible in the implementation.

<!-- snippet: src/function-apis.ts#sortedTitlesAndIndexes -->
```ts
export function sortedTitles<T extends Titled>(
  items: readonly T[],
  render: (item: T) => string = (item) => item.title,
): string[] {
  return [...items]
    .sort((left, right) => left.title.localeCompare(right.title))
    .map(render);
}

export function indexByKey<T, K>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Map<K, T> {
  const index = new Map<K, T>();
  for (const item of items) {
    const key = keyOf(item);
    if (index.has(key)) {
      throw new Error(`Duplicate key: ${String(key)}`);
    }
    index.set(key, item);
  }
  return index;
}
```

The copied array makes the sorting contract true at runtime: callers retain
their original order. The render callback receives the full caller type, not
only a title, so it may use a task ID when producing text. This is a design
choice worth testing. A readonly parameter prevents an obvious write in this
function; the copy prevents sort from mutating through a different reference.

The index function illustrates a different kind of ownership. It builds a new
Map and returns it to the caller. The generic key type preserves whether the
caller chose a string ID, a number, or a literal union. Duplicate detection is
part of this API's stated behavior, not an accidental consequence of assigning
twice into a map. Decide such collision behavior at the function boundary,
where callers can test and handle it.

## Records and maps at an API edge

An object parameter describes a fixed, named set of options. Record describes a
key-value object when its keys themselves are data. Map describes an
operational collection with explicit lookup, insertion order, and size; it is
usually not the first choice for a JSON-shaped options parameter. Keep public
input to the smallest shape a function needs, then choose Record or Map inside
when collection semantics matter. The domain-modeling chapter develops those
choices with task indexes and labels.

For example, a formatter that must receive a count for every known state can
accept a Record keyed by the finite state union. The checker then requires all
of those keys at the call site. An index whose keys are discovered while
iterating should return a Map instead: its key type can be any comparable
JavaScript value, it advertises lookup operations, and it has no implication
that the result should serialize as a JSON object. Do not turn a Map into a
Record merely because both use keys; select the type that communicates the
caller's operation and ownership.

## A call-site review checklist

Before publishing or changing a function, review it from the caller's side:

1. Which arguments are required, and which are omitted versus explicitly
   undefined?
2. Are defaults preserving meaningful falsy values such as zero and false?
3. Does each callback expose only the values its caller needs?
4. Does the return type preserve useful information, or did an overly broad
   type erase it?
5. Can the function mutate a caller-owned value, and is that promise explicit
   and tested?

The exercise translates a plausible Python-style list helper into a strict API
that preserves these distinctions.
