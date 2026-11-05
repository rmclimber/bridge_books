/** Checked examples for designing strict TypeScript function APIs. */
export type Titled = { title: string };

export type TaskSummary = Titled & {
  id: string;
  labels: readonly string[];
};

export type ListOptions = {
  limit?: number;
  prefix?: string;
};

// #region listTitles
export function listTitles(
  tasks: readonly Titled[],
  options: ListOptions = {},
): string[] {
  const limit = options.limit ?? tasks.length;
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative safe integer.");
  }

  const prefix = options.prefix ?? "";
  return tasks.slice(0, limit).map((task) => `${prefix}${task.title}`);
}
// #endregion listTitles

// #region withAddedLabel
export function withAddedLabel<T extends TaskSummary>(task: T, label: string): T {
  if (label.trim() === "") {
    throw new RangeError("label must not be blank.");
  }

  return { ...task, labels: [...task.labels, label] };
}
// #endregion withAddedLabel

export function forEachTitle<T extends Titled>(
  items: readonly T[],
  visit: (item: T, index: number) => void,
): void {
  items.forEach((item, index) => visit(item, index));
}

// #region sortedTitlesAndIndexes
export function sortedTitles<T extends Titled>(
  items: readonly T[],
  render: (item: T) => string = (item) => item.title,
): string[] {
  return [...items]
    .sort((left, right) => left.title.localeCompare(right.title))
    .map(render);
}

export function indexByKey<T, K>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Map<K, T> {
  const index = new Map<K, T>();
  for (const item of items) {
    const key = keyOf(item);
    if (index.has(key)) {
      throw new Error(`Duplicate key: ${String(key)}`);
    }
    index.set(key, item);
  }
  return index;
}
// #endregion sortedTitlesAndIndexes

export function firstItem<T>(items: readonly [T, ...T[]]): T;
export function firstItem<T>(items: readonly T[]): T | undefined;
export function firstItem<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function describeTarget(target: string | Titled): string {
  return typeof target === "string" ? target : target.title;
}
