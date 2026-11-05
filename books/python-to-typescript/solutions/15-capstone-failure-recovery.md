# Exercise 14: Preserve a failed save -- solution

## Worked solution

Start with known-good JSON containing an open task. A `TextFiles` double can
throw an error carrying `code: "ENOSPC"` from `write`. `TaskStore.save` wraps
that unexpected I/O error as `TaskStorageError`, so the command's awaited save
rejects before `dependencies.write("Paused t1")` runs. Because the fake never
changes its stored text, the old open-task document remains observable.

The resulting acceptance assertions are: rejection matches `Could not write`,
the output array is empty, and the stored text does not contain `paused`.
Those assertions test the promise boundary and user-visible effect order,
rather than the internal method-call count.

## Assign each failure to its boundary

Blank command tokens are command syntax and should reject with usage before
loading or saving. A blank paused reason found in JSON is invalid external data
and belongs to the parser, even if a command would normally prevent it.
`ENOSPC` is an unexpected storage failure: preserve its cause, reject, and let
the CLI communicate failure. A timeout only delays observation; a catch-all
success message lies; an automatic retry can repeat a full-disk operation with
no recovery policy.

## Common wrong turns

- Writing `Paused t1` before awaiting `save` recreates the false-green bug.
- Returning an empty list after every storage error makes a denied read look
  like a new ledger.
- Catching the low-level error without preserving it leaves operators unable
  to distinguish malformed data from an unavailable disk.
