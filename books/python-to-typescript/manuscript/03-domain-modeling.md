# Domain modeling: unions, collections, generics, and structural typing

Python lets a domain object reveal capabilities through its runtime methods and
attributes. Strict TypeScript adds a second design tool: describe the allowed
shapes up front, then let the compiler narrow those shapes as code proves facts
about them. This chapter models the in-memory task data that the capstone will
later persist and validate at its runtime boundary.

## Make states explicit with a discriminated union

Do not represent a task's completion with unrelated optional fields such as
`done?: boolean` and `completedAt?: Date`. That permits nonsense combinations:
an unfinished task with a completion time. Instead, put a literal tag in every
variant. `kind` is the discriminant; checking it selects exactly one shape.

<!-- snippet: src/domain-modeling.ts#summarizeTasks -->
```ts
export function summarizeTasks(tasks: readonly Task[]): string[] {
  return tasks.map((task) => {
    switch (task.state.kind) {
      case "open":
        return `[open] ${task.title}`;
      case "done":
        return `[done ${task.state.completedAt.toISOString()}] ${task.title}`;
      case "paused":
        return `[paused: ${task.state.reason}] ${task.title}`;
    }
  });
}
```

The complete checked example is
[`src/domain-modeling.ts`](../src/domain-modeling.ts). In the `"done"` branch,
`completedAt` exists without an assertion because the union says it does. With
strict checking, adding a future state such as `"archived"` makes this switch
fail to return a `string` until it handles that state. The tag is not runtime
validation: JSON still needs the boundary checks from Chapter 1 before it can
be trusted as `TaskState`.

## Choose collections for their semantics

Use an object when it is a named record with known fields. For a dynamic lookup
table keyed by task ID, use `Map<string, Task>`: it provides explicit lookup,
insertion order, and a size without object-prototype edge cases. For unique
labels, use `Set<string>`; adding `"book"` twice still produces one member.
Arrays retain order and duplicates, so `readonly Task[]` is the natural input
when callers provide a sequence that this code must not mutate.

`readonly` protects through that reference at compile time; it does not freeze
the array or each task at runtime. Return a new `Map` or `Set` when the caller
should own a new collection, and keep mutation local to its construction.

## Reuse an operation with generics

`indexById<T extends HasId>` can index tasks, notes, or any future record with
an `id`. The generic preserves each caller's full item type, rather than
throwing it away as `HasId`. Its constraint states the one property the
algorithm needs. This is more precise than accepting `object` or `any`.

## Structural typing is static compatibility

TypeScript is structural: a value is assignable when it has the required
shape, not when it explicitly declares it implements a named interface. A note
with `{ id, body }` can use `findById<T extends HasId>` even though it is not a
`Task`. This resembles Python duck typing, but the check happens while
compiling and only describes the values flowing through typed code. It does
not inspect arbitrary runtime data or establish a nominal identity. Keep
runtime validation at external boundaries, and use structural types inside
the trusted domain.

## Exercises

The next exercise asks you to extend this model without using optional fields
to hide an invalid state.
