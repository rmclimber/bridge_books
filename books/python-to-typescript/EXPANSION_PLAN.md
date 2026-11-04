# Expansion plan for the full Python to TypeScript transition

## Purpose

The current 13-page manuscript is a validated foundation, not the complete
book described in the original plan. It proves the authoring workflow, strict
TypeScript examples, tests, capstone seed, and assessment convention. It does
not yet provide enough practice, workflow guidance, or depth to support the
book's stated transition goal.

This plan restores the intended reader-facing target of 52--64 pages and a
25--35-page solutions workbook. These ranges are planning checks, not padding
quotas: every added page must map to a competency, misconception, exercise,
capstone behavior, or professional workflow decision. If a topic reaches its
learning outcome more concisely, stop there; if evidence shows it needs more
space, add only the material that closes the demonstrated gap.

## Editorial rules for expansion

- Keep the current chapters as concise foundations. Expand around them with
  additional examples and exercises where the matrix identifies a real gap.
- Every major topic must use the Python intuition -> counterexample ->
  TypeScript model -> idiomatic application -> practice sequence.
- Each expansion slice includes checked source, tests, learner-facing practice,
  worked explanation, matrix evidence, and a page-budget update.
- A build that passes does not complete a slice. The slice must also meet its
  planned learning outcome; page contribution is an estimate to review, never
  a reason to add filler.
- Frameworks, browser UI, databases, deployment architecture, and exhaustive
  standard-library reference remain out of scope.

## Target architecture

| Part | Focus | Target pages | Required evidence |
| --- | --- | ---: | --- |
| 0 | Orientation, setup, and the mental-model map | 4--5 | Reproducible setup, compiler/runtime diagram in prose, prediction checks |
| 1 | Runtime boundaries, inference, narrowing, and values | 7--8 | Parser variants, type-error prediction, absence/numeric/equality tests |
| 2 | Functions, object shapes, unions, and generics | 8--9 | API design refactor, structural-typing exercise, checked generic helpers |
| 3 | Classes, modules, ESM, and package workflow | 6--7 | Import-resolution/debugging exercise, package-script walkthrough |
| 4 | Async control flow, errors, persistence, and debugging | 7--8 | Promise-order tests, error taxonomy exercise, persistence failure fixtures |
| 5 | Testing and maintainable change | 5--6 | Unit/integration boundary, test-design exercise, debugging transcript |
| 6 | Task-ledger capstone iterations | 7--8 | Feature increments, migration, CLI acceptance tests, review checklist |
| 7 | Exit assessment, rubric, and next specializations | 3--4 | Independent task, evaluator guide, self-assessment |
|  | **Reader-facing total** | **52--64** | |

The solutions workbook should contain expanded explanations for every exercise,
including common wrong answers and the reasoning behind the chosen design. Its
target is 25--35 pages. The existing workbook is a seed, not a release-ready
length.

## Planned expansion slices

### E1 — Orientation and static-model foundations

**Goal:** turn the current front matter and runtime-boundary chapter into a
practical orientation rather than an assumption-heavy opening.

**Add:** project setup verification; what TypeScript checks versus what Node
runs; inference versus annotation; assignability and excess-property
surprises; never and exhaustiveness as maintenance aids; a prediction exercise
for compile-time versus runtime failures.

**Acceptance:** 4--5 new reader pages; two checked examples; one type-error
prediction exercise with explanation; matrix coverage for inference and
assignability.

### E2 — Function and API design

**Goal:** give Python programmers enough function-level design vocabulary to
write and read ordinary TypeScript libraries.

**Add:** parameter/return inference; optional parameters versus undefined;
default values; callback signatures; generic function design; overloads versus
unions; readonly views and mutation contracts; object literals, Record, and
Map tradeoffs.

**Acceptance:** 6--7 new reader pages; a translation-and-idiomatization
exercise; checked function API examples; tests for callback, generic, and
mutation behavior.

### E3 — Objects, classes, and module boundaries

**Goal:** deepen the current structural-typing and ESM material into codebase
navigation guidance.

**Add:** interfaces versus type aliases; class state versus module functions;
private fields and runtime privacy limits; composition; type-only imports;
dependency direction; package scripts; common NodeNext resolution diagnostics.

**Acceptance:** 6--7 new reader pages; a debug-the-transition exercise using a
real compiler/runtime diagnostic; a small multi-module refactor with tests.

### E4 — Async control flow, errors, and persistence

**Goal:** move beyond one awaited file operation to the decisions readers meet
in production Node code.

**Add:** Promise lifecycle and ordering; Promise.all error behavior; when
sequential awaits are necessary; error classes and cause; expected versus
unexpected errors; resource cleanup; persistence update/migration cases; a
debugging walkthrough.

**Acceptance:** 6--7 new reader pages; deterministic Promise-order tests;
one error-class exercise; one persistence-migration exercise with fixtures.

### E5 — Testing, debugging, and maintainable change

**Goal:** make professional workflow a first-class outcome rather than a
side-effect of the example repository.

**Add:** unit versus integration tests; assertion selection; test fixtures and
dependency injection; reading a failure; breakpoints/source maps as optional
workflow; pnpm scripts, lockfiles, and a clean-checkout verification path.

**Acceptance:** 5--6 new reader pages; test-design exercise; realistic broken
test repair; documented repository-navigation checklist.

### E6 — Capstone iterations

**Goal:** evolve the task ledger in observable increments instead of presenting
one finished command layer.

**Add:** planned features for labels/filtering, paused state migration, command
validation, persistence failure recovery, and a small report command. Each
increment must name the domain, persistence, and test changes separately.

**Acceptance:** 7--8 new reader pages; at least three independently tested
capstone increments; CLI acceptance tests for success and failures; a
maintainer review checklist.

### E7 — Assessment and integration pass

**Goal:** revise the exit assessment after the expanded capstone exists and
check that every mandatory matrix row has both explanation and assessment.

**Add:** an assessment starter fixture or patch-based grading guide; rubric
examples; a final mental-model recap; explicit further-study paths.

**Acceptance:** 3--4 new reader pages; workbook reaches its target range;
matrix audit is recorded; all manuscript links, snippets, tests, and PDFs pass.

## Expansion gates

1. Before each slice, update the matrix with the exact misconception, evidence,
   chapter location, and expected page contribution.
2. After each slice, run repository checks, build both PDFs, inspect the
   changed pages, and record the new page count in PROJECT_STATE.md.
3. At roughly 30--35 pages, conduct a whole-book prerequisite and duplication
   review before writing more.
4. As the targets are approached, conduct practitioner and learner review.
   Page count alone never grants release readiness, and a shorter book may be
   ready if it has demonstrated every required competency without padding.

## First authorized expansion candidate

Start with E1. It closes the earliest prerequisite gap, gives readers a map for
the later chapters, and establishes the page-budget discipline before deeper
capstone work begins.
