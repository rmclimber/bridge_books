# Exercise 6: Predict the checker

Assume this strict TypeScript contract:

```ts
type RetrySettings = {
  retries: number;
  strategy: "fixed" | "backoff";
};

declare function retrySummary(settings: RetrySettings): string;
```

For each numbered line below, predict whether TypeScript accepts it. Then say
whether an accepted line proves anything about JSON received from a file.

```ts
const fromConfig = {
  retries: 2,
  strategy: "fixed" as const,
  source: "config",
};

retrySummary(fromConfig);                                      // 1
retrySummary({ retries: 2, strategy: "fixed", source: "config" }); // 2
retrySummary({ retries: "2", strategy: "fixed" });            // 3
```

Next, extend this union with a `{ kind: "stale"; ageDays: number }` variant:

```ts
type ImportStatus =
  | { kind: "ready"; count: number }
  | { kind: "missing" };

function unreachable(value: never): never {
  throw new Error(String(value));
}

function summarize(status: ImportStatus): string {
  switch (status.kind) {
    case "ready":
      return `Ready: ${status.count}`;
    case "missing":
      return "No import file";
    default:
      return unreachable(status);
  }
}
```

4. Without adding a `case`, identify the line that should now fail and explain
   why its argument is no longer `never`.
5. Repair the switch. Then explain why this compiler check does not replace the
   runtime parser for an imported JSON value.
