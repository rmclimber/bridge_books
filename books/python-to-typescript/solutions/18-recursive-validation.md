# Exercise 15: Validate an import without hiding its defects -- solution

## Expected issues

The ordered paths are `tasks[0].title`, `tasks[0].done`,
`tasks[0].labels`, and `tasks[1]`. Their order follows the input traversal and
field order, which makes test output reproducible and lets a user fix an import
without repeatedly discovering a new first error.

## Worked reasoning

Begin with `unknown` and prove the outer record plus `tasks` array. For each
array item, prove a non-null, non-array record before reading properties. Check
each field independently, append a path-specific issue for every failure, and
construct a new trusted task only when all checks for that item succeed. Return
`ok: false` whenever any issue exists; do not return the partly accumulated
valid task list because the chosen import policy is atomic.

Fail fast when one missing prerequisite makes further checks unsafe or noisy:
for example, when the outer value has no tasks array. Aggregate when sibling
fields are independently meaningful and one correction cycle is kinder to the
caller. Neither policy comes from TypeScript automatically; it is part of the
runtime boundary contract.

## Common wrong turns

- Casting `value as { tasks: TaskDraft[] }` changes no runtime value and cannot
  find the nested number in `labels`.
- Returning valid tasks beside errors silently creates a partial import unless
  the API names and documents that policy.
- Using array indexes as paths is appropriate for this external JSON shape;
  using internal variable names makes errors harder to act on.
