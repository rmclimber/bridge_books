# Exercise 13: Plan a capstone increment

The ledger needs `list --label urgent` and `report`. Before changing code,
write a five-row change map with one row each for domain, persistence, command,
output, and test evidence. State which rows require a code change and which
remain unchanged.

Then implement the commands in a branch or copy. Your evidence must show that
a duplicate label is not stored twice, a filtered list does not write the task
file, and a report includes open, paused, and done counts. Run `pnpm run check`.

Finally, explain in 100--150 words why `report` is a read model rather than a
persisted second representation.
