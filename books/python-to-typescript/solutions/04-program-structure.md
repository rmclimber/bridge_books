# Exercise 4: Repair the formatter callback — solution

## Hint

Ask what expression supplies `this` at the moment `format` is called. A bare
function call does not call through the formatter object.

## Worked solution

```ts
const titles = tasks.map((task) => formatter.format(task));
```

The arrow callback closes over `formatter`, then calls `format` as
`formatter.format(task)`. That call expression supplies the receiver, so
`this.prefix` exists. `tasks.map(formatter.format)` passes a function value;
when `map` later calls it, it does not call it as a method of `formatter`.
`formatter.format.bind(formatter)` is another valid repair when an API needs a
standalone callback, but the inline arrow is usually clearer at this call site.

The type-only ESM import is:

```ts
import type { Task } from "./domain-modeling.js";
```

The `.js` suffix names the JavaScript file Node will run; TypeScript resolves
it to the sibling source while checking. `openTaskTitles` is a module-level
function because it needs only its argument, not per-instance state.
