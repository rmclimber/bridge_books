# Objects, classes, and module boundaries

Python makes it comfortable to put behavior on objects early: a dictionary can
become a class, a class can grow helper methods, and import cycles are often
only noticed when the program starts. TypeScript gives you those options, but
its structural type system and Node ESM make the boundary choice visible in
both the source and the emitted JavaScript. The useful question is not “should
this be object oriented?” It is “which values own stable state, and which
operations are simply transformations of their arguments?”

This chapter uses a deliberately small refactor:

`Task` domain data -> task-view query functions -> stateful report formatter

The arrows are dependencies, not a call stack. The domain has no knowledge of
presentation. The query module imports the domain *type*. The report imports
the query value it calls and the types it describes. That direction keeps the
model usable from a CLI, a file store, or a later user interface without asking
the model to import one of its consumers.

## Object shape first: `type` and `interface`

In Python, a parameter annotated with a protocol-like shape may feel like a
statement about what an object can do. TypeScript object types make that shape
the ordinary starting point. Two independently declared values are compatible
when their required public members match; they do not need the same base class.

Both a `type` alias and an `interface` can name an object shape:

```ts
type Labeled = {
  labels: readonly string[];
};

interface Titled {
  title: string;
}

function labelLine(item: Labeled & Titled): string {
  return `${item.title}: ${item.labels.join(", ")}`;
}
```

For a local data model, prefer the form that describes it most clearly. A
`type` alias is especially natural when the name might be a union,
intersection, tuple, mapped type, or primitive alias. An `interface` is
often a readable name for a public object contract and supports declaration
merging, which some libraries intentionally use. Neither choice creates a
runtime constructor, validates input, or makes nominal identity. Do not turn a
plain data shape into a class merely to obtain a name.

The example above also shows a practical structural-typing habit: depend on the
smallest shape needed. `labelLine` does not require a `Task`;
any value with a `title` and readonly `labels` works. The
earlier domain chapter remains the place to choose a discriminated union for
real state variants. This chapter concerns how modules consume that model.

## Choose functions when arguments are enough

A module-level function is the default for an operation that needs only
explicit inputs. It is easier to test, has no receiver to lose, and makes its
dependencies visible in its parameter list and imports. The query module below
accepts trusted `Task` values and returns a presentation-friendly
structural view. It neither mutates a task nor knows how the view will be
rendered.

<!-- snippet: src/task-views.ts#selectOpenViews -->
```ts
export type TaskView = {
  id: string;
  title: string;
  state: Task["state"]["kind"];
};

export function toTaskView(task: Task): TaskView {
  return { id: task.id, title: task.title, state: task.state.kind };
}

export function selectOpenViews(tasks: readonly Task[]): TaskView[] {
  return tasks
    .filter((task) => task.state.kind === "open")
    .map(toTaskView);
}
```

`readonly Task[]` promises that this module will not replace, append,
or reorder caller-owned array slots through this reference. It does not
deep-freeze the task objects; a readonly view is a contract about this API, not
a runtime lock. Returning a fresh array gives callers their own collection to
use. The function is a good boundary because the selection is wholly described
by `tasks`; no instance-specific configuration is needed.

## Introduce a class for stable owned state

A class earns its place when multiple operations share configuration, a
resource, or evolving state. `TaskReport` owns a rendering prefix. The
prefix is not another argument every caller should remember to pass, and the
class groups the operations that use it. It *composes* the query function
instead of inheriting from a task or putting report behavior on the domain
object.

<!-- snippet: src/task-report.ts#renderOpenReport -->
```ts
export class TaskReport {
  #prefix: string;

  constructor(prefix: string) {
    this.#prefix = prefix;
  }

  render(view: TaskView): string {
    return `${this.#prefix}${view.id}: ${view.title}`;
  }

  renderOpen(tasks: readonly Task[]): string[] {
    return selectOpenViews(tasks).map((view) => this.render(view));
  }
}
```

Composition says “uses” without claiming “is a.” A report uses the view query;
a `Task` is not a report. This has a concrete navigation benefit:
follow an import from `task-report.ts` to `task-views.ts`, then
to `domain-modeling.ts`; do not add an import in the reverse direction.
If the domain imports its renderer, a persistence change can accidentally drag
presentation into a low-level layer and a cycle becomes much easier to create.

The method call inside `map` is intentionally wrapped in an arrow.
As Chapter 4 showed, `views.map(this.render)` loses the method receiver.
`views.map((view) => this.render(view))` calls through the instance, so
`this` remains the report.

## Private is two related but different promises

The older `TaskFormatter` example uses TypeScript's `private`
modifier. That prevents TypeScript callers from naming the field, but it is
primarily a checker rule. The emitted JavaScript has an ordinary property; a
JavaScript caller that ignores the type checker can still reach it.

`TaskReport` uses the JavaScript private-field syntax,
`#prefix`. That field is enforced by the JavaScript language at runtime:
normal outside code cannot write `report.#prefix`, and property
enumeration does not reveal a public `"prefix"` key. This is useful
encapsulation, but it is not a security boundary. Do not put secrets in a
client process or rely on a field modifier to validate hostile input.

Choose `private` when a compile-time API boundary is sufficient and
`#private` when the runtime object should enforce the boundary too.
Either way, expose behavior such as `renderOpen`, not a public field
that forces every consumer to reimplement formatting rules.

## ESM imports are part of the program

Look at the imports above, not just the class:

```ts
import type { Task } from "./domain-modeling.js";
import { selectOpenViews } from "./task-views.js";
import type { TaskView } from "./task-views.js";
```

`import type` means the dependency exists only while TypeScript checks
the source. With this project's `verbatimModuleSyntax` setting, the
distinction is explicit and the type-only imports are not emitted for Node to
load. `selectOpenViews`, by contrast, is called at runtime and must be a
value import.

Under `module` and `moduleResolution` set to `NodeNext`,
write `"./task-views.js"` in the TypeScript source. TypeScript connects
that specifier to the sibling `task-views.ts` while checking, then emits
the same `.js` specifier for Node. Writing `"./task-views"`
looks natural to a Python importer but triggers a real compiler diagnostic:

```text
TS2835: Relative import paths need explicit file extensions in EcmaScript imports
when '--moduleResolution' is 'node16' or 'nodenext'.
```

Adding `.ts` is not the fix for this configuration: Node runs the
emitted JavaScript, not TypeScript source. Add `.js`. If JavaScript
nevertheless reports `ERR_MODULE_NOT_FOUND`, inspect the emitted
`dist` directory and the exact specifier first; then confirm that the
runtime import was not incorrectly marked type-only or omitted from the build.

## Let scripts make the workflow repeatable

Do not memorize a long compiler command or diagnose by opening the generated
files first. Ask the project what it promises:

```text
pnpm run typecheck
pnpm test
pnpm run verify:snippets
pnpm run check
```

`check` is the pre-change and pre-review gate in this book: it
type-checks, runs the Node tests, and verifies that marked manuscript snippets
still equal the executable source. When it fails, start at the first diagnostic
and classify it. A `TS2835` is a module-specifier problem; a
`Cannot find name` message is usually a missing import or a value/type
confusion; a Node `ERR_MODULE_NOT_FOUND` occurs after compilation and
points to what Node actually tried to load. This classification prevents a
common transition mistake: changing types in response to a runtime resolver
error, or changing runtime paths to silence a checker-only complaint.

## A boundary checklist

Before adding a class or a new import, make the decision observable:

1. Can a module function express the operation from its arguments alone?
2. If a class owns configuration or state, which methods are its public
   behavior, and could composition keep it independent of the domain object?
3. Is each import a runtime value import or a type-only import?
4. Do imports flow from application or presentation code toward the domain,
   without the domain importing its consumers?
5. Does `pnpm run check` pass before treating the refactor as complete?

The next exercise repairs a transition-style module mistake and explains the
diagnostic rather than merely making it disappear.
