# Exercise 8: Diagnose an ESM report refactor — solution

## Hint

Separate names the checker needs from values JavaScript will execute. Then ask
which expression supplies `this` when `map` invokes a callback.

## Worked solution

The imports are:

```ts
import type { Task } from "./domain-modeling.js";
import { selectOpenViews } from "./task-views.js";
import type { TaskView } from "./task-views.js";
```

`Task` and `TaskView` are used only in annotations, so
`import type` prevents an unnecessary runtime dependency. The query
function is called, so it is a value import. In NodeNext source, `.js`
names the file Node will load after compilation. TypeScript maps that specifier
back to the TypeScript source while checking. A `.ts` specifier points
at authoring source that ordinary Node does not execute.

One valid class is:

```ts
class TaskReport {
  #prefix: string;

  constructor(prefix: string) {
    this.#prefix = prefix;
  }

  renderOpen(tasks: readonly Task[]): string[] {
    return selectOpenViews(tasks).map((view) => this.render(view));
  }

  render(view: TaskView): string {
    return `${this.#prefix}${view.title}`;
  }
}
```

`map(this.render)` passes a function value. When `map` invokes
it, the call does not go through the `TaskReport` instance, so
`this` is not the report. The arrow callback closes over the surrounding
method's `this` and calls `this.render(view)`; that call
expression provides the receiver.

`#prefix` is a JavaScript runtime-private field, unlike a TypeScript
`private` modifier that is chiefly a static checking restriction. It
still does not encrypt a value, validate hostile input, or make a process
secure against someone who controls its environment.

The dependency direction is:

```text
domain-modeling  <-  task-views  <-  task-report
```

The arrows show “imports from.” Keeping the domain at the bottom means a task
model can be used by CLI, persistence, and report code without depending on
any of them. A domain-to-report import reverses that direction and invites a
cycle when report code already needs task data.

## Common wrong turns

Changing only one import to end in `.js` does not repair the module: every
relative ESM specifier that Node must load needs the emitted-file extension.
Changing them to `.ts` merely moves the problem to runtime, because the
compiled program contains JavaScript files. Treat the compiler's `TS2835`
as a path-and-module-mode diagnostic, not a request to loosen
`moduleResolution`.

It is also easy to use an ordinary `private prefix: string` field and call
that “runtime private.” It is a useful TypeScript API restriction, but not the
same JavaScript mechanism as `#prefix`. Conversely, do not choose
`#prefix` because you need a secret: field privacy neither encrypts data
nor validates input from an untrusted source.

Another tempting repair is to put `selectOpenViews` on `Task` or make
`TaskReport` inherit from a task class. Neither is warranted here. The
selection is a transformation of supplied tasks; the report merely uses its
result while owning a prefix. The small composition boundary prevents report
policy from leaking into the domain model.

Finally, run `pnpm run check` after the edit. A type check confirms the
specifier and type/value distinction, the tests prove the query and report
behavior, and snippet verification confirms that the reader-facing source
still equals the executable example.
