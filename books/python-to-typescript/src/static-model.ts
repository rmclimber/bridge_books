/** Checked examples for TypeScript's static model. */
export type RetrySettings = {
  retries: number;
  strategy: "fixed" | "backoff";
};

// #region checkedSettings
export const defaultSettings = {
  retries: 3,
  strategy: "backoff",
} satisfies RetrySettings;

export function retrySummary(settings: RetrySettings): string {
  return `${settings.strategy}:${settings.retries}`;
}

const commandLineSettings = {
  retries: 1,
  strategy: "fixed" as const,
  source: "cli",
};

export const acceptedFromVariable = retrySummary(commandLineSettings);

// Object literals are checked for likely misspelled or unwanted fields.
// @ts-expect-error source is not part of RetrySettings.
retrySummary({ retries: 1, strategy: "fixed", source: "cli" });
// #endregion checkedSettings

// #region summarizeImport
export type ImportStatus =
  | { kind: "ready"; count: number }
  | { kind: "missing" };

function unreachable(value: never): never {
  throw new Error(`Unhandled import status: ${JSON.stringify(value)}`);
}

export function summarizeImport(status: ImportStatus): string {
  switch (status.kind) {
    case "ready":
      return `Ready: ${status.count} record(s)`;
    case "missing":
      return "No import file";
    default:
      return unreachable(status);
  }
}
// #endregion summarizeImport
