# Exit assessment and next steps

The guided capstone already teaches labels, pauses, reports, and failed writes.
The independent task is therefore a different transfer: make a legacy JSON
field optional at the boundary while making it required in the trusted model.
Complete [`assessments/exit-assessment.md`](../assessments/exit-assessment.md):
add a literal-union `Priority`, default missing legacy values to `"normal"`,
and create command and test evidence without a prescribed patch.

Start with the supplied JSON fixture and checklist, but not the workbook. In a
fresh branch, write a change map for model, parser, command, output, and tests.
Make one small change at a time and run the full check before reading the
evaluator guide.

## What good evidence looks like

`prioritize t1 urgent` is invalid command syntax. A missing task is a domain
result after a successful load. `{ "priority": "urgent" }` in JSON is
untrusted data and must fail at parsing. A missing JSON priority is the one
compatibility case: the parser constructs `"normal"`. These different facts
need different tests and messages.

Replacing an array item computes a candidate result; it does not make it
durable. The command may print `Prioritized t1 high` only after `save` resolves.
A rejecting file port should leave no success output and preserve known-good
contents. A filtered list is a query, so it must not write just to make old
JSON acquire defaults.

## Final mental model

1. Parse `unknown` values into trusted data; annotations cannot validate JSON.
2. Use discriminants and literal unions to make valid states explicit.
3. Keep parsing, domain policy, I/O, presentation, and command tokens at
   distinct module boundaries.
4. Await the effect that makes success output true; test rejection and order.
5. Prefer observable test contracts to private call counts.
6. Use a change map and `pnpm run check` for every cross-cutting change.

## Further study

For web work, add HTTP semantics, routing, and browser boundaries. For services
and CLIs, study structured logging, signals, concurrency, and stronger storage
guarantees. For larger TypeScript codebases, practice package APIs, code
review, linting, and compatibility. Study conditional/mapped types and schema
libraries only after the runtime-versus-static boundary is comfortable.

Use the evaluator guide only after recording your own design and tests. The
goal is to explain why the boundaries make your change safe, not to match one
reference implementation.
