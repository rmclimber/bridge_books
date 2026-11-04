# Exercise 4: Repair the formatter callback

`TaskFormatter` owns a prefix, but this code fails when it formats a list:

```ts
class TaskFormatter {
  constructor(private readonly prefix: string) {}

  format(task: { title: string }): string {
    return `${this.prefix}${task.title}`;
  }
}

const formatter = new TaskFormatter("Task: ");
const titles = tasks.map(formatter.format);
```

1. Explain why the Python expectation that `formatter.format` remembers
   `formatter` is wrong here.
2. Repair the final line without changing `format` into an arrow property.
3. A sibling source file is `domain-modeling.ts`. Write the ESM import that
   uses only its exported `Task` type under this project's `NodeNext` settings.
4. Decide whether `openTaskTitles` should be a module-level function or a
   method on `Task`. State the dependency or state that justifies your choice.
