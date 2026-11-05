# Whole-book prerequisite and duplication review -- 2026-11-05

## Scope and evidence

This integration pass reviewed the canonical manuscript order, exercise and
solution numbering, checked snippet registry, task-ledger source, acceptance
tests, and the competency matrix at 35 manuscript pages. It is a planning and
editorial audit, not a release review.

## Prerequisite continuity

The sequence is sound: runtime values before static inference; value semantics
before domain unions; function contracts before module boundaries; async
storage before migration; then test boundaries before capstone evolution. The
capstone already relies on every preceding topic, so E6 should not introduce
new language mechanisms. It should make the existing mechanisms visible as a
maintainer changes a real program.

One corrective action is required: readers need to see that adding a union
variant changes the domain, boundary parser, command transition, output, and
tests together. E6 therefore develops labels/filtering, paused work, failure
behavior, and reporting as separate increments rather than showing one final
command switch.

## Duplication and terminology

Intentional repetition remains useful where a concept crosses a boundary:
`unknown` appears at JSON boundaries; `await` appears at persistence and
command success output; discriminated unions appear first as a model and later
as a migration obligation. These passages serve different decisions and stay.

No redundant chapter needs removal. The notable risk is two different
presentations of persistence evolution: the migration chapter uses versioned
documents, while the capstone store reads a task array. E6 names that
distinction explicitly: versioned-document migration is a reusable boundary
pattern; the capstone parser remains responsible for accepting legacy open and
done array entries and validating the new paused variant.

## Corrective editorial decisions

- Keep the foundation chapters concise; do not retroactively pad them.
- Replace the large capstone command listing as the main teaching device with
  small, checked slices for a state transition and a report.
- Retain `pause` in the exit assessment, but revise that assessment during E7
  so it asks learners to combine or extend the finished capstone rather than
  reproduce an already taught command.
- Maintain the existing command terminology: **task state**, **persistence
  boundary**, **command layer**, **acceptance test**, and **report**.

## Matrix audit and next gate

All P0 rows have explanation and at least one executable evidence source. The
E6 row now needs evidence for cross-module feature delivery, including a
failed write that produces no success output. After E6, E7 must audit that the
independent assessment no longer duplicates a guided capstone increment.
