# Exercise 15: Validate an import without hiding its defects

A batch has `tasks`, where each task needs a non-empty `title`, a boolean
`done`, and an array of string `labels`. Design a `BatchValidation` result that
either returns trusted tasks or all independent issues.

For this input, predict the ordered paths your validator should report:

```ts
{ tasks: [{ title: "", done: "no", labels: ["book", 3] }, null] }
```

Implement the validator without `any` or type assertions. Explain when you
would choose fail-fast instead, and why a valid task beside invalid tasks should
not silently be imported under this exercise's policy.
