# Exercise 1: Repair the boundary — solution

## Hint

The function must establish the shape at runtime before its return type can be
trusted. First rule out `null`, arrays, and non-objects; then check each field.

## Worked solution

```ts
type TaskDraft = { title: string; done: boolean };
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function importDraft(input: unknown): TaskDraft {
  if (!isRecord(input)) {
    throw new TypeError("A task draft must be an object.");
  }
  const { title, done } = input;
  if (typeof title !== "string" || typeof done !== "boolean") {
    throw new TypeError("Invalid task draft.");
  }
  return { title, done };
}
```

With the original function, the return annotation only convinces the compiler;
the string call fails at runtime because `7` has no `trim` method. The rewritten
function uses `unknown` to prevent property access until its checks establish a
record and valid field types. `input as TaskDraft` would still only assert the
same unverified claim, so it is not validation.
