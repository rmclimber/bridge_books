# Exercise 8: Diagnose an ESM report refactor

A teammate starts a report module with code shaped by familiar Python imports:

```ts
import { Task } from "./domain-modeling";
import { selectOpenViews } from "./task-views";

class TaskReport {
  constructor(private readonly prefix: string) {}

  renderOpen(tasks: readonly Task[]): string[] {
    return selectOpenViews(tasks).map(this.render);
  }

  render(view: { id: string; title: string }): string {
    return `${this.prefix}${view.title}`;
  }
}
```

Under this repository's strict `NodeNext` configuration, TypeScript
reports `TS2835`: relative ESM import paths need explicit file
extensions. After a hasty edit, the teammate changes the first line to
`import { Task } from "./domain-modeling.ts"`; a Node run later cannot
find the emitted module.

1. Write the three imports this file should use, distinguishing its two
   type-only dependencies from the runtime function it calls.
2. Explain why the correct relative specifier ends in `.js` even though
   the authored files end in `.ts`.
3. Repair `renderOpen` without making `render` an arrow
   property. Explain the JavaScript receiver rule involved.
4. The report prefix must be enforced as a runtime private field. Change the
   class field and constructor appropriately, then state one thing that this
   privacy does *not* provide.
5. Draw the intended dependency direction among domain model, task-view query,
   and report. Why should the domain not import the report?
