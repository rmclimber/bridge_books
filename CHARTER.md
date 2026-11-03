# Bridge Books — Project Charter

**Status:** Foundational project guidance  
**Scope:** All books in the `bridge_books` repository  
**Primary audience:** Experienced programmers learning a new programming language  
**Initial source language:** Python (not a permanent restriction)

## 1. Mission and learning promise

Bridge Books is a series of concise, technically rigorous, practice-driven guides that help an experienced programmer transfer from a known **source language** to a **target language**. Each book focuses on the *delta* between the languages: where existing knowledge transfers, where seemingly familiar constructs behave differently, and where a new paradigm or mental model is required.

The series does **not** reteach general introductory programming concepts unless doing so is necessary to explain a meaningful difference. It also does **not** aim to produce deep expertise in the target language or its entire application ecosystem.

**Exit goal:** A successful learner can independently implement, test, debug, and explain nontrivial programs in the target language; navigate and make useful contributions to an ordinary professional codebase; and approach typical language-relevant coding interviews without major foundational gaps. They should know what further ecosystem specialization remains.

This is a realistic readiness objective, not a guarantee of interview performance or immediate productivity in every codebase.

## 2. Product and publication decisions

1. **One book per directed transition.** A book is identified by both source and target language (for example, *TypeScript for Python Programmers*). The initial collection may emphasize Python as the source, but the framework must allow other sources.
2. **Direction matters.** Python → TypeScript is a different product from TypeScript → Python. Do not assume that reversing examples yields a suitable course.
3. **Books stand alone.** Each has its own scope, manuscript, exercises, solutions, example code, capstone, build process, and version information. Shared standards and tooling live at the repository root.
4. **Length follows competencies.** Target a short, dense technical book where practical; use approximately 25–50 pages as an initial planning heuristic for a relatively close transition, but allow substantially more for systems or paradigm shifts. Do not omit essential foundations to hit a page target. Specify whether page counts include exercises, solutions, and appendices.
5. **Digital-first, manuscript-first.** Keep human-reviewable text and code as canonical sources in Git. Produce PDF and optionally HTML/ePub as reproducible artifacts; do not treat an exported PDF as the source of truth.
6. **Code is part of the publication.** Substantive examples, exercise scaffolds, and model solutions should live in executable source files and be validated automatically where practical.
7. **Pedagogical consistency, not uniform content.** Use shared authoring and quality standards, but let each language pair determine its own sequence, depth, examples, tools, and page count.
8. **Reuse the existing book project playbook.** Codex has access to a separate repository containing our established book-production playbook. Before selecting or implementing the publishing workflow, Codex must locate and read that playbook, identify reusable conventions, and propose any bridge-specific adaptations rather than inventing a competing process.

## 3. Learner assumptions and boundaries

The default learner has substantial experience writing, debugging, and maintaining programs in the source language. They understand functions, control flow, data structures, modularity, testing, and basic software engineering.

Do not assume familiarity with the target language's type system, runtime, memory model, concurrency model, build tools, package ecosystem, or dominant programming paradigm. Explicitly state additional prerequisites for each book.

**In scope:** target-language syntax where it differs meaningfully; semantics; type and data models; evaluation and execution; resource or memory management; errors; concurrency where central; idioms; relevant tooling; tests; debugging; and enough ecosystem orientation to work in a conventional repository.

**Out of scope by default:** basic programming instruction, exhaustive standard-library reference, advanced language theory beyond its instructional value, specialized application frameworks, deployment architecture, and comprehensive interview preparation. Exceptions require an explicit rationale tied to exit competencies.

## 4. Teaching principles

### Teach the delta

Classify each important topic as one or more of:

- **Direct transfer:** existing source-language knowledge applies with little adjustment.
- **False friend:** similar appearance or terminology conceals different behavior.
- **New mechanism:** a construct or abstraction without a close familiar equivalent.
- **Paradigm shift:** a different way to organize reasoning or program structure.
- **Operational difference:** different compiler/runtime, dependency, build, test, debugging, or deployment expectations.
- **Idiomatic difference:** valid code that a professional target-language developer would normally express differently.

Spend the least time on direct transfer and the most time on consequential misconceptions, foundational new ideas, and paradigm changes.

### Explain through contrasting mental models

Prefer a recurring instructional sequence:

1. **Source-language intuition:** the learner's likely starting model.
2. **Prediction or counterexample:** a small case showing where it succeeds or fails.
3. **Target-language explanation:** the accurate semantic or conceptual model.
4. **Idiomatic application:** how a practitioner would write or structure the solution.
5. **Practice and feedback:** an exercise requiring independent use of the model.

Avoid oversimplified comparisons that become false at the next level of detail. Distinguish specification guarantees, common conventions, and implementation-dependent behavior.

### Prioritize transfer over memorization

Examples and exercises should require learners to predict behavior, translate *and improve* code, explain errors, debug plausible failures, and build small authentic programs. Avoid generic introductory drills unless the target language makes them conceptually new.

### Teach professional judgment

Explain not just what compiles or runs, but what is safe, maintainable, idiomatic, and testable. Mark optional advanced topics clearly so they do not obscure the minimum foundation.

## 5. Required educational components of each book

Each book should include, in a language-appropriate order:

1. **Orientation and explicit prerequisites:** target versions, intended reader, what will and will not be covered, setup and verification.
2. **Mental-model map:** major semantic and paradigm differences; a short list of high-impact mistaken assumptions.
3. **Essential mappings:** concise language comparisons, emphasizing meaningful differences rather than basic syntax inventory.
4. **Core new abstractions:** types, data, memory, evaluation, effects, or other target-specific fundamentals.
5. **Idioms and failure modes:** misleading patterns, debugging cases, and professional conventions, integrated throughout rather than isolated in one chapter.
6. **Professional workflow:** project layout, dependencies, build/run, testing, formatting/linting, debugging, and reading unfamiliar code.
7. **Progressive exercises:** short concept checks, behavior predictions, translations/refactors, and realistic bug fixes, with answer explanations.
8. **Capstone:** a small, representative project that integrates the central competencies, with observable acceptance criteria and tests.
9. **Exit assessment and next steps:** a rubric for the stated learning outcomes, self-check prompts, and clear boundaries for further study.

A chapter need not correspond one-to-one with these components. Use the sequence best suited to the transition.

## 6. Competency and misconception matrix

Before drafting the outline, create a matrix that drives scope and assessment. At minimum record:

| Field | Meaning |
| --- | --- |
| Competency | What the learner must be able to explain, implement, or debug |
| Source-language expectation | Knowledge or habit the learner brings |
| Target-language reality | Accurate target-language behavior or practice |
| Transfer category | Direct transfer, false friend, new mechanism, paradigm, operational, idiomatic |
| Severity | Consequence of misunderstanding (high/medium/low) |
| Frequency | Likelihood of encountering it (high/medium/low) |
| Evidence | Example, exercise, test, or capstone behavior demonstrating mastery |
| Location | Planned section/chapter; later actual coverage |

Prioritize high-severity/high-frequency gaps. **Every mandatory exit competency must map to at least one assessment.** Conversely, every substantial chapter should justify its inclusion through a competency. The matrix is a living planning and review artifact.

## 7. Exercise and assessment design

Use a varied, escalating set of assessments:

- **Predict and explain:** behavior, output, compile/type errors, and edge cases; require reasoning, not guesses.
- **Translate and idiomatize:** start from a familiar source-language solution, implement it in the target language, then improve the design using target-language conventions.
- **Debug the transition:** repair realistic mistakes made by programmers importing source-language assumptions.
- **Implement independently:** solve a problem in the target language without source-language scaffolding.
- **Capstone:** complete and test a modest professional-style project in the target ecosystem.

Provide solutions with *explanations of why*, including common wrong answers. Keep learner-facing materials separate from answer keys where practical. Use executable fixtures for deterministic tasks; identify tasks whose correctness requires review rather than a test alone.

Assess the three dimensions separately:

1. **Language competence:** correct semantics, abstractions, and idioms.
2. **Professional readiness:** toolchain, tests, debugging, repository navigation, and maintainable changes.
3. **Independent problem solving:** implementing and explaining unfamiliar tasks without guided translation.

The book should offer a clear rubric, not an unsupported promise of guaranteed employability or interview success.

## 8. Authoring and engineering standards

- **Canonical sources:** version-controlled Markdown/Quarto/LaTeX or another deliberately chosen text-based format; select the stack during repository bootstrap, not independently for every book without cause.
- **Executable code:** maintain full runnable or compilable files for substantive examples; embed or generate manuscript snippets from validated files when feasible to prevent drift.
- **Versioning:** pin or document language/compiler/runtime and key dependency versions. State explicitly when behavior is version-sensitive.
- **CI quality gates:** build the manuscript, validate links/references where feasible, format/lint/type-check code as appropriate, execute examples and tests, and build the final publication artifact.
- **Reproducibility:** give exact setup commands; use locks or equivalent dependency records where appropriate; keep generated outputs separate from authoritative source.
- **Technical accuracy:** distinguish semantic guarantees from idiomatic advice and implementation details; verify unusual claims against official documentation or language specifications where possible.
- **Editorial quality:** concise but not cryptic, consistent terminology, useful code comparisons, readable formatting, and no unexplained jumps in prerequisite knowledge.
- **Review:** obtain target-language practitioner review when feasible. AI-generated text and code are drafts to be validated, not presumed correct.
- **Accessibility:** code should be copyable, diagrams accompanied by prose, and exercises understandable without proprietary tools wherever feasible.

## 9. Repository model

Illustrative layout (adjust names once the publication toolchain is selected):

```text
bridge_books/
├── README.md
├── CHARTER.md
├── shared/
│   ├── authoring-guidelines.md
│   ├── book-template/
│   └── prompts/
│       ├── start-bridge.md
│       ├── plan-slice.md
│       └── review-slice.md
├── books/
│   ├── python-to-typescript/
│   │   ├── README.md
│   │   ├── book-plan.md
│   │   ├── competency-matrix.md
│   │   ├── manuscript/
│   │   ├── examples/
│   │   ├── exercises/
│   │   ├── solutions/
│   │   ├── capstone/
│   │   └── tests/
│   └── ...
├── scripts/
└── .github/workflows/
```

Keep shared guidance authoritative at the root. Book-specific documents may refine it but should explicitly record justified exceptions rather than silently diverge. Reuse generic tooling and editorial standards; do **not** force semantic explanations or exercises into reusable boilerplate when language differences make that misleading.

## 10. Development lifecycle and slices

### Stage 0 — Repository foundation (once)

- Establish charter, lightweight README, contribution conventions, book template, authoring format, and minimum CI/build skeleton.
- Add reusable Codex prompts for starting a bridge, planning a slice, and reviewing a slice.
- Avoid building a complex curriculum generator or content reuse engine before validating one book.

**Gate:** a minimal sample book can be built and its sample code tested reproducibly.

### Stage 1 — Book definition (per bridge)

- Select **source → target**, learner prerequisites, target-language version(s), likely professional use cases, and exclusions.
- Research high-impact differences and create the competency/misconception matrix.
- Identify the capstone and design its acceptance criteria.
- Specify the minimum exit assessment and rough page budget.

**Gate:** all promised exit competencies are defined, prioritized, and assessable; the capstone covers the important ones without turning into a framework course.

### Stage 2 — Curriculum design

- Derive the table of contents from the matrix rather than from a generic target-language feature list.
- Map competencies to chapters, examples, exercises, and assessments.
- Define progressive **vertical slices**: a slice contains its explanation, executable examples, exercises, solutions, and tests—not just prose.
- Identify prerequisites between slices and choose an order that minimizes cognitive jumps.

**Gate:** every chapter has a rationale and at least one observable learning outcome; major gaps and redundancies are identified.

### Stage 3 — Pilot slice

- Build one high-value slice (preferably a consequential false friend or paradigm shift) end-to-end.
- Validate technical correctness, exercise quality, manuscript rendering, code execution, and the expected page density.
- Revise conventions based on what failed.

**Gate:** the pilot demonstrates that the authoring and assessment model works without excessive manual repair.

### Stage 4 — Iterative authoring

For each slice:

1. Agree on the goal, prerequisites, files, acceptance criteria, and likely pitfalls.
2. Implement explanatory text and validated code examples.
3. Add exercises, solution explanations, and executable checks where possible.
4. Check coverage against the competency matrix.
5. Run the relevant test/build suite and perform technical/editorial review.
6. Integrate the slice and update progress, unresolved questions, and dependencies.

**Gate:** a slice is not done until its code, exercises, solutions, and manuscript build pass relevant checks and it serves its assigned competency.

### Stage 5 — Integration and evaluation

- Complete capstone and exit assessment; test them independently of the explanatory chapters.
- Check overall consistency, prerequisite continuity, duplication, and missing competencies.
- Perform a practitioner review and ideally a trial with an experienced source-language programmer new to the target.
- Record misunderstandings that persist and revise accordingly.

**Gate:** the book's stated readiness outcomes are supported by demonstrated assessments, not merely chapter coverage.

### Stage 6 — Publication and maintenance

- Build a reproducible release, document tested language/tool versions, and tag a book release independently.
- Maintain an errata/changelog and a route for reader feedback.
- Review compatibility when the target language or toolchain changes; distinguish editorial changes from substantive semantic updates.

**Gate:** a clean checkout can reproduce published examples, tests, and the release artifact using documented instructions.

## 11. Decision principles and tradeoffs

- **Correctness over brevity:** cut low-value topics, not essential semantic caveats.
- **Depth over breadth at the foundation:** cover fewer concepts well enough to use them safely rather than enumerate every feature.
- **Idiomatic use over literal translation:** comparison is a starting point, not the end state.
- **Executable validation over plausible-looking snippets:** particularly important for generated content.
- **Explicit scope over scope creep:** specialized frameworks belong in later modules unless needed for the capstone.
- **Independent books over a monolith:** releases, prerequisites, and maintenance vary by language pair.
- **Simple shared infrastructure over premature abstraction:** extract common tooling after repeated real needs appear.
- **Human-guided iterative development over one-shot book generation:** plan and review slices with Codex, preserving editorial judgment and quality gates.

## 12. Working agreement for Codex

When Codex is given this charter and a proposed source → target transition, it should **collaborate on the plan before drafting an entire book**.

Codex should:

1. **Locate and read the existing book project playbook repository** available in its environment, along with relevant templates, prompts, and build instructions. Identify what to reuse for manuscript authoring, builds, validation, and publication. If it cannot locate or access the playbook, say so and request its repository location before making consequential publishing/toolchain choices. Treat this charter as the source of educational and project-specific requirements, and the playbook as the default authority for established book-production procedures; surface any conflicts for a decision rather than silently overriding either.
2. Confirm or propose explicit assumptions about reader proficiency, target versions, learning outcomes, and scope; ask only questions that materially affect the plan.
3. Propose a competency/misconception matrix, identifying the most dangerous false friends and major paradigm changes.
4. Recommend a realistic capstone, exit assessment, chapter outline, and provisional length, with tradeoffs.
5. Break the work into small, independently testable vertical slices, each with deliverables and acceptance criteria.
6. Help craft the specific implementation prompt for the **next** slice; execute only the slice authorized by the user.
7. Validate examples and manuscript builds, state what was actually tested, and flag unresolved accuracy or design concerns.
8. Keep planning artifacts synchronized as decisions evolve; record deviations from shared standards.
9. Never silently invent unverified language-specific claims, imply code was executed when it was not, or treat generated prose as sufficient evidence of learning efficacy.

Human decisions should remain explicit for pedagogical scope, capstone selection, major architecture/toolchain choices, and acceptance of release readiness.

## 13. Definition of done

A bridge book is complete when:

- [ ] The audience, source/target direction, prerequisites, version assumptions, and exclusions are explicit.
- [ ] All mandatory competencies have explanatory coverage and at least one meaningful assessment.
- [ ] High-impact source-language misconceptions are explicitly addressed and exercised.
- [ ] Substantive code examples compile or run under the documented toolchain, or documented exceptions are justified.
- [ ] Exercises have validated solutions and useful explanatory feedback.
- [ ] The capstone tests integration of the central skills and is reproducible.
- [ ] Language competence, professional workflow, and independent implementation have separate exit checks.
- [ ] The manuscript and published artifact build reproducibly from the repository.
- [ ] Technical/editorial review findings and known limitations are resolved or disclosed.
- [ ] Version, changelog/errata policy, and next-step resources are published.

## 14. Open decisions to resolve during bootstrap

These should **not** block agreeing to the charter:

- Manuscript toolchain (for example, Quarto/Pandoc versus LaTeX-first), PDF/HTML/ePub formats, and snippet inclusion mechanism.
- How far to automate exercise grading, and whether solutions are separate releases or simply separate directories.
- Initial release/licensing policy and contribution workflow.
- CI strategy for multiple target runtimes and the policy for supported language versions.
- Whether pilot learner testing is available before the first release.

Resolve these by the simplest approach that demonstrably supports the first bridge; revisit after experience with at least one complete book.

---

## Appendix A — Codex kickoff prompt (copy and customize)

> We are developing a new book in the `bridge_books` repository. Read `CHARTER.md` and the existing shared guidance before planning. **Also locate and read the separate book project playbook repository you have access to**, including its applicable templates and production workflow. Reuse its established authoring, building, and publishing conventions where they fit; identify any adaptations needed for executable multi-language examples. If you cannot find or access the playbook, ask me where it is before proposing a new book-production stack. The proposed directed bridge is **[SOURCE LANGUAGE] → [TARGET LANGUAGE]**. Assume an experienced **[SOURCE LANGUAGE]** programmer; target use case **[OPTIONAL PROFESSIONAL CONTEXT]**. Do not draft chapters yet.
>
> First, identify any important assumptions requiring a decision. Then propose (1) explicit exit competencies, (2) a prioritized source-to-target misconception matrix, (3) a realistic capstone and exit assessment, (4) a provisional outline with page-budget range, and (5) a sequence of small vertical implementation slices with concrete acceptance criteria. Distinguish language fundamentals from optional ecosystem specialization. Explain the hardest tradeoffs and recommend a starting pilot slice. Work with me to refine the plan and then craft the prompt for the first approved slice.

## Appendix B — Slice prompt template

> Implement **[SLICE ID/TITLE]** for **[SOURCE] → [TARGET]** under the shared charter, the existing book project playbook, and the book's current plan. Consult the playbook's relevant instructions before making authoring/build/publishing changes; if the playbook is inaccessible, flag that rather than silently replacing its conventions. The assigned competencies are **[LIST]**; prerequisites are **[LIST]**. Deliver: (a) concise manuscript material emphasizing the transition in mental model, (b) executable target-language examples, (c) at least one misconception-revealing exercise, (d) worked solutions with explanations, (e) automated validation where feasible, and (f) any necessary updates to the competency matrix and build configuration. Follow **[TOOLCHAIN/VERSIONS]**. Do not expand into other slices. Run relevant tests/builds, report actual results and limitations, and explain any departures from the agreed plan. Acceptance criteria: **[CRITERIA]**.
