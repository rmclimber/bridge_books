/** Checked examples for absence, equality, numeric limits, and mutation. */
export type RetryPolicy = {
  retryLimit?: number | null;
};

export const DEFAULT_RETRY_LIMIT = 3;

// #region chooseRetryLimit
export function chooseRetryLimit(policy: RetryPolicy): number {
  const candidate = policy.retryLimit;
  if (candidate === null || candidate === undefined) {
    return DEFAULT_RETRY_LIMIT;
  }
  if (!Number.isSafeInteger(candidate) || candidate < 0) {
    throw new RangeError("retryLimit must be a non-negative safe integer.");
  }
  return candidate;
}
// #endregion chooseRetryLimit

export function hasSameTaskId(left: string | number, right: string | number): boolean {
  return left === right;
}

export function parseOpaqueId(value: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new TypeError("An opaque ID must contain decimal digits only.");
  }
  return BigInt(value);
}

export function withAddedLabel(labels: readonly string[], label: string): string[] {
  return [...labels, label];
}
