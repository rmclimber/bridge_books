/** Checked examples for sequencing, aggregation, and async cleanup. */
export type AsyncStep<T> = () => Promise<T>;

// #region runSequentially
export async function runSequentially<T>(
  steps: readonly AsyncStep<T>[],
): Promise<T[]> {
  const results: T[] = [];
  for (const step of steps) {
    results.push(await step());
  }
  return results;
}

export function runTogether<T>(steps: readonly AsyncStep<T>[]): Promise<T[]> {
  return Promise.all(steps.map((step) => step()));
}
// #endregion runSequentially

export interface AsyncClosable {
  close(): Promise<void>;
}

// #region useResource
export async function useResource<TResource extends AsyncClosable, TResult>(
  resource: TResource,
  use: (resource: TResource) => Promise<TResult>,
): Promise<TResult> {
  try {
    return await use(resource);
  } finally {
    await resource.close();
  }
}
// #endregion useResource
