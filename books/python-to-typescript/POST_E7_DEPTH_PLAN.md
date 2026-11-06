# Post-E7 depth plan

The planned E1--E7 sequence is complete. Depth slices address demonstrated
gaps in the framework-free transition. Page estimates are planning guides.

## D1 -- Recursive validation and actionable error aggregation

**Gap:** The P0 runtime-boundary chapter validates a shallow record and stops
at its first error. Ordinary Node programs also receive nested arrays and need
to explain several independent defects without casting untrusted data.

**Add:** a checked recursive import parser for a small task batch; typed
validation issues with stable property paths; an aggregated error result;
tests for nested invalid values and multiple issues; a prediction/debugging
exercise and worked solution; a focused manuscript extension explaining
fail-fast versus aggregate policy and boundary ownership.

**Do not add:** schema libraries, browser frameworks, database tooling, or a
generic validation framework.

**Acceptance:** 4--6 dense reader pages; one executable recursive parser and
tests; one learner exercise with worked solution; matrix evidence for nested
untrusted data and error reporting; repository checks, both PDF builds, and
visual inspection.

## D2 -- Deriving types for API boundaries

**Gap:** The book introduces generic constraints and uses indexed access in
the task view. Learners need practice deriving a narrow API contract and
distinguishing static assignability from runtime field selection.

**Evidence:** A Python dictionary projection compared with the TypeScript
task view, a contract derived with `Pick` and indexed access, and checks for
compiler diagnostics and exact runtime output. Exercise 16 asks for a related
projection. Its worked solution is checked TypeScript with a synchronized
workbook excerpt.

After D2, use practitioner and learner review to assess whether the async
chapter needs an applied cancellation example.
