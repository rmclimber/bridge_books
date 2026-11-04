# Competency and Misconception Matrix

| Priority | Competency | Python expectation | TypeScript reality | Category | Evidence | Planned location |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Validate external data safely | An annotation can validate a value | Types are erased; untrusted values are `unknown` until checked | False friend | Parser tests, Exercise 1, and capstone import | Chapter 1: Runtime boundaries |
| P0 | Use `any` and `unknown` appropriately | `Any` is an unconstrained value | `any` removes checking; `unknown` requires narrowing | False friend | Exercise 1 explanation and parser tests | Chapter 1: Runtime boundaries |
| P0 | Model absence | `None` is the absence value | `null`, `undefined`, omission, and falsiness differ | False friend | Optional-field bug fix | Slice 3 |
| P0 | Reason about structural typing | Duck typing is runtime capability | Structural compatibility is static and has boundaries | Paradigm shift | Assignability exercise | Slice 4 |
| P0 | Use asynchronous I/O safely | `async` maps directly to coroutines/tasks | Async functions return Promises with distinct scheduling and rejection behavior | False friend | Filesystem tests | Slice 6 |
| P0 | Select collection types | A dictionary is the default mapping | Objects, `Record`, `Map`, and `Set` have different semantics | False friend | Data-structure choice task | Slice 4 |
| P1 | Use equality deliberately | Equality/truthiness are familiar | Prefer `===`; coercion and falsiness are consequential | False friend | Predict-and-explain exercise | Slice 3 |
| P1 | Respect numeric limits | Integers are arbitrary precision | `number` is IEEE-754; `bigint` is separate | Operational difference | Identifier/money failure case | Slice 3 |
| P1 | Organize a project | Imports are straightforward inclusion | ESM resolution and package metadata shape execution | Operational difference | Package-layout task | Slice 5 |
| P1 | Avoid `this` callback failures | Instance methods retain their receiver | `this` depends on call site | New mechanism | Callback bug repair | Slice 5 |

