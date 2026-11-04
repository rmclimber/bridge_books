# Program structure: modules, functions, classes, and `this`

Python files are modules, and TypeScript files become JavaScript modules after
compilation. The familiar word hides a workflow difference: this project uses
Node ESM, so source imports name the emitted `.js` file, even when the source
file is `.ts`. That explicit extension lets Node resolve the same module that
TypeScript checked.

## Export narrow operations from a module

Start with a module-level function when an operation needs only its arguments.
`openTaskTitles` is easy to test because it has no hidden receiver or mutable
object state. `import type` brings `Task` to the type checker but emits no
runtime import; use it when an import is purely a type dependency.

<!-- snippet: src/task-presentation.ts#openTaskTitles -->
```ts
import type { Task } from "./domain-modeling.js";

export function openTaskTitles(tasks: readonly Task[]): string[] {
  return tasks
    .filter((task) => task.state.kind === "open")
    .map((task) => task.title);
}
```

The `.js` suffix is intentional. With `module` and `moduleResolution` set to
`NodeNext`, TypeScript checks this against `domain-modeling.ts` and emits an
import Node can execute. Do not reach for a barrel file or a class just to make
a small module feel organized; use one when it clarifies a public boundary.

## A method is not automatically a Python bound method

Classes are useful when values share stable configuration or state. Here a
formatter owns its prefix. In Python, retrieving `formatter.format` produces a
bound method that remembers `formatter`. In JavaScript, a method's `this` is
chosen by the call expression. Passing `formatter.format` directly to `map`
loses its receiver; use a small arrow function (or `bind` when an API requires
a callback function).

<!-- snippet: src/task-presentation.ts#formatTasks -->
```ts
  format(task: Task): string {
    return `${this.prefix}${task.title}`;
  }

  formatAll(tasks: readonly Task[]): string[] {
    return tasks.map((task) => this.format(task));
  }
```

The complete checked module is
[`src/task-presentation.ts`](../src/task-presentation.ts). `formatAll` keeps
the receiver by calling the method through `this` inside an arrow callback.
An arrow function has no `this` of its own, so it uses the surrounding method's
receiver. This is a call-site rule, not a TypeScript-only rule: it is how the
emitted JavaScript behaves at runtime.

## Keep dependencies directional

Let the domain module define `Task`; let presentation code import that type;
do not make the domain module import presentation. This one-way dependency
makes the model reusable by a future CLI or persistence module, reduces cycles,
and gives a practical answer to “where should this function live?”: beside the
data it fundamentally owns, or in a narrow module that depends on it.

## Exercises

The next exercise repairs an unbound callback and makes the ESM import explicit.
