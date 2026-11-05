import { readFile } from "node:fs/promises";

const checks = [
  {
    manuscript: "manuscript/01-static-model-map.md",
    source: "src/static-model.ts",
    region: "checkedSettings",
  },
  {
    manuscript: "manuscript/01-static-model-map.md",
    source: "src/static-model.ts",
    region: "summarizeImport",
  },
  {
    manuscript: "manuscript/01-runtime-boundaries.md",
    source: "src/runtime-boundary.ts",
    region: "parseTaskDraft",
  },
  {
    manuscript: "manuscript/02-values-that-look-familiar.md",
    source: "src/value-pitfalls.ts",
    region: "chooseRetryLimit",
  },
  {
    manuscript: "manuscript/03-function-api-design.md",
    source: "src/function-apis.ts",
    region: "listTitles",
  },
  {
    manuscript: "manuscript/03-function-api-design.md",
    source: "src/function-apis.ts",
    region: "withAddedLabel",
  },
  {
    manuscript: "manuscript/03-function-api-design.md",
    source: "src/function-apis.ts",
    region: "sortedTitlesAndIndexes",
  },
  {
    manuscript: "manuscript/03-domain-modeling.md",
    source: "src/domain-modeling.ts",
    region: "summarizeTasks",
  },
  {
    manuscript: "manuscript/04-program-structure.md",
    source: "src/task-presentation.ts",
    region: "openTaskTitles",
  },
  {
    manuscript: "manuscript/04-program-structure.md",
    source: "src/task-presentation.ts",
    region: "formatTasks",
  },
  {
    manuscript: "manuscript/04-objects-modules.md",
    source: "src/task-views.ts",
    region: "selectOpenViews",
  },
  {
    manuscript: "manuscript/04-objects-modules.md",
    source: "src/task-report.ts",
    region: "renderOpenReport",
  },
  {
    manuscript: "manuscript/05-async-persistence.md",
    source: "src/task-store.ts",
    region: "loadTasks",
  },
  {
    manuscript: "manuscript/06-capstone-integration.md",
    source: "src/task-ledger.ts",
    region: "runTaskLedger",
  },
];

function normalize(text) {
  return text.replaceAll("\r\n", "\n").trim();
}

for (const check of checks) {
  const [manuscript, source] = await Promise.all([
    readFile(check.manuscript, "utf8"),
    readFile(check.source, "utf8"),
  ]);
  const sourceMatch = source.match(
    new RegExp(`// #region ${check.region}\\r?\\n([\\s\\S]*?)// #endregion ${check.region}`),
  );
  const snippetMatch = manuscript.match(
    new RegExp(`<!-- snippet: ${check.source.replaceAll(".", "\\.")}#${check.region} -->\\r?\\n\\x60\\x60\\x60ts\\r?\\n([\\s\\S]*?)\\r?\\n\\x60\\x60\\x60`),
  );

  if (!sourceMatch || !snippetMatch || normalize(sourceMatch[1]) !== normalize(snippetMatch[1])) {
    throw new Error(`Snippet ${check.source}#${check.region} is missing or out of sync.`);
  }
}

console.log(`Verified ${checks.length} manuscript snippet source(s).`);
