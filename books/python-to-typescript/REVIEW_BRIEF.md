# Python to TypeScript review brief

This draft is for experienced Python programmers learning strict TypeScript
for Node.js libraries and command-line tools. Use the
[book PDF](output/python-to-typescript.pdf) and the matching source checkout.
Share only the learner section and these opening instructions with the learner
so their first answer is independent. Each review is a focused first pass.
Record the page, exercise, or file, what happened, and whether it blocked
progress, caused confusion, or was a minor issue.

## Practitioner review (about 30–45 minutes)

- Read the sections on runtime boundaries, derived API types, and async control
  flow. Look for incorrect claims, misleading Python comparisons, or patterns
  that would be unsafe or surprising in an ordinary Node codebase.
- From a clean copy, try the [README setup](README.md#commands) and run
  `pnpm run check`. Inspect one example and its tests. Flag anything the prose
  promises that the implementation or tests fail to demonstrate.
- Check whether [Exercise 9](exercises/09-async-control-flow.md) and the async
  chapter give a reader enough to reason about a rejected aggregate Promise,
  ongoing work, and cleanup. If applied cancellation is missing, name one
  realistic case and the smallest example that would address it.

## Learner review (about 25–35 minutes)

- Try the [README setup](README.md#commands). Record the first point where you
  need to guess or look something up, and what you expected from Python.
- Read the async control-flow section and attempt [Exercise 9](exercises/09-async-control-flow.md).
  Write your reasoning before opening the [solutions workbook](output/python-to-typescript-workbook.pdf).
- Answer this follow-up in your own words. Two operations have started in
  `Promise.all`. One rejects while the other is still running. What happens
  next? If the second operation is designed to support cancellation, how would
  you ask it to stop, and how would you know its cleanup had finished?
  Note where the book helped and where you had to infer or look up the answer.

## After both reviews

Record the learner's first answer before discussing it. If they correctly
predict that the second operation can keep running but cannot explain how the
caller requests a stop, how the operation observes it, or how cleanup is
awaited, consider a small checked `AbortSignal` example. Ask the practitioner
whether that gap matters for the book's Node scope. If the confusion starts
with what `Promise.all` does, revise the existing explanation and retest the
prompt. If the learner can explain both behaviors, the current coverage is enough.
