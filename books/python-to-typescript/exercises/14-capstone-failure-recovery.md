# Exercise 14: Preserve a failed save

Create a `TextFiles` test double whose `write` rejects with an `ENOSPC` error.
Use it to attempt `pause t1 Blocked`. Prove that the command rejects, does not
write `Paused t1`, and does not replace the stored open task.

Then identify where each concern belongs: blank command tokens, a blank paused
reason in JSON, and an unavailable disk. Do not add a timeout, catch-all
success message, or automatic retry. Explain why each would hide rather than
recover from this failure in the scoped local CLI.
