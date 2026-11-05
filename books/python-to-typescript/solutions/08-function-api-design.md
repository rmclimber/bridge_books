# Exercise 7: Translate a list helper into a stable API — solution

## Worked solution

```ts
type Titled = { title: string };
type TaskLike = Titled & { id: string; labels: readonly string[] };

type TitleListOptions = {
  limit?: number;
  transform?: (title: string, index: number) => string;
};

function titleList(
  tasks: readonly TaskLike[],
  options: TitleListOptions = {},
): string[] {
  const limit = options.limit ?? tasks.length;
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative safe integer.");
  }

  return [...tasks]
    .sort((left, right) => left.title.localeCompare(right.title))
    .slice(0, limit)
    .map((task, index) => options.transform?.(task.title, index) ?? task.title);
}

function withAddedLabel<T extends TaskLike>(task: T, label: string): T {
  return { ...task, labels: [...task.labels, label] };
}
```

The readonly task array prevents this implementation from sorting the caller's
array through its parameter. The explicit copied array is the runtime part of
that promise: sorting a copy preserves the original order. Readonly labels
give the same no-write view, while the new label array is intentionally owned
by the returned object.

Nullish coalescing preserves a zero limit; a double-pipe default would replace
zero with the array length. The runtime range check remains necessary because
a value can enter from untyped JavaScript or a parsed configuration file. The
callback receives a string and its output index; its return is explicitly a
string, so a mistaken callback result is caught at the call site.

The generic helper returns T, not TaskLike. Given a task with an owner field,
TypeScript knows the returned value also has an owner. That preservation is
useful because the implementation copies the whole task before replacing
labels.

## Union, not overloads

Use a union for a stable return type:

```ts
function describeTarget(target: string | { title: string }): string {
  return typeof target === "string" ? target : target.title;
}
```

Both input forms produce a string, so overloads would add declarations without
giving callers stronger information. Use overloads when the input form changes
the return type—such as a statically non-empty tuple producing T while an
ordinary array produces T or undefined.

## Test evidence

The tests should show all four contracts:

- a zero limit returns an empty array;
- a callback receives titles in copied-and-sorted order;
- the original task array and labels are unchanged;
- a returned task from the generic helper retains owner.

Common mistakes are using a truthiness default for limit, sorting the caller's
array in place, and returning TaskLike from the generic helper. Each makes a
caller lose a fact that the API can preserve.
