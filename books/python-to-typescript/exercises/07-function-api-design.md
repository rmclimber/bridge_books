# Exercise 7: Translate a list helper into a stable API

A teammate translated this Python-flavored helper directly:

```ts
type TaskLike = { id: string; title: string; labels: string[] };

function titleList(
  tasks: TaskLike[],
  limit?: number,
  transform?: (title: string) => string,
): string[] {
  tasks.sort((left, right) => left.title.localeCompare(right.title));
  return tasks
    .slice(0, limit || tasks.length)
    .map((task) => transform ? transform(task.title) : task.title);
}
```

Refactor it for a strict TypeScript library.

1. Keep zero as a meaningful limit, reject a negative or non-integer limit,
   and distinguish omission from a supplied value.
2. Do not mutate the caller's task array or its labels. Make that intent
   visible in the signature.
3. Replace the unrelated optional positional arguments with an options object.
   Keep the callback typed.
4. Add a generic helper that appends a label while preserving a caller's extra
   field such as owner.
5. Explain whether a union or overloads are more appropriate for a function
   that accepts either a task title string or a title-bearing object and always
   returns a string.

Write tests for a zero limit, callback behavior, input non-mutation, and an
extra field preserved by your generic helper.
