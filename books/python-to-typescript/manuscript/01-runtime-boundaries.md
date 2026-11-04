# Runtime boundaries: types vanish, values do not

Python annotations can support tools, but Python still receives whatever a file,
command line, or network peer sends. TypeScript makes this split sharper:
types are checked while compiling and are erased before Node runs. A parameter
annotated as `TaskDraft` is not a runtime parser.

This chapter's working rule is simple: data from outside your program starts as
`unknown`; turn it into a useful type only after a runtime check. `unknown` is
not an inconvenience to cast away. It records that the program has not earned
the right to read properties or call methods yet.

## Predict the boundary

Suppose a JSON file contains `{ "title": 42, "done": false }`. This compiles:

```ts
type TaskDraft = { title: string; done: boolean };
const draft = JSON.parse(text) as TaskDraft;
```

The assertion changes TypeScript's static view; it changes neither the parsed
value nor the JavaScript runtime. The first string operation on `draft.title`
can therefore fail. `as` is appropriate only when some separate, trustworthy
invariant has already been established. It is not validation.

## Narrow before using

Start with `unknown`, then prove the facts needed by the domain model. The
parser below accepts only an object with a non-empty string title and a boolean
completion flag. It deliberately returns a new object, so the rest of the
program depends on the checked fields rather than on the original input.

<!-- snippet: src/runtime-boundary.ts#parseTaskDraft -->
```ts
export function parseTaskDraft(value: unknown): TaskDraft {
  if (!isRecord(value)) {
    throw new TypeError("A task draft must be an object.");
  }

  const { title, done } = value;
  if (typeof title !== "string" || title.trim() === "") {
    throw new TypeError("A task draft needs a non-empty string title.");
  }
  if (typeof done !== "boolean") {
    throw new TypeError("A task draft needs a boolean done flag.");
  }

  return { title, done };
}
```

The complete checked example is [`src/runtime-boundary.ts`](../src/runtime-boundary.ts).
The `isRecord` guard eliminates `null` and arrays, both of which are JavaScript
objects but not the key-value record required here. The two `typeof` checks then
narrow each property. After every condition succeeds, TypeScript can justify the
`TaskDraft` return type and JavaScript has actually checked the data.

## `any` versus `unknown`

`any` means “stop checking this value.” You can read arbitrary properties,
call arbitrary methods, and pass it to a typed API. That convenience also lets
unvalidated data cross the boundary unnoticed. `unknown` means “a value exists,
but its shape is not yet known.” You must narrow it before use.

Prefer `unknown` for values from JSON, environment variables, CLI arguments,
plugin hooks, and untyped JavaScript. Prefer a specific type after a parser or
guard establishes its invariant. Keep `any` at rare, isolated interoperability
edges, with a comment explaining why a safer type cannot express the contract.

## Boundary checklist

For every external input, ask:

1. Where did this value enter the program?
2. Which facts must be true before the domain code can use it?
3. Which runtime checks establish those facts?
4. What error should a malformed value produce?

The same pattern will later validate persisted task data in the capstone. A
static type describes the values your code intends to handle; a parser decides
whether an arriving value belongs to that set.

## Exercises

The next section asks you to repair the same boundary yourself.
