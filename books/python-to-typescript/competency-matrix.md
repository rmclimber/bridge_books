# Competency and Misconception Matrix

| Priority | Competency | Python expectation | TypeScript reality | Category | Evidence | Planned location |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Validate external data safely | An annotation can validate a value | Types are erased; untrusted values are `unknown` until checked | False friend | Parser tests, Exercise 1, and capstone import | Chapter 1: Runtime boundaries |
| P0 | Use `any` and `unknown` appropriately | `Any` is an unconstrained value | `any` removes checking; `unknown` requires narrowing | False friend | Exercise 1 explanation and parser tests | Chapter 1: Runtime boundaries |
| P0 | Model absence | `None` is the absence value | `null`, `undefined`, omission, and falsiness differ | False friend | Exercise 2 and retry-policy tests | Chapter 2: Values that look familiar |
| P0 | Model domain variants safely | State may be represented by loose flags or nullable fields | Discriminated unions make valid variants explicit and narrow by tag | New mechanism | Task-state tests and Exercise 3 | Chapter 3: Domain modeling |
| P0 | Reason about structural typing | Duck typing is runtime capability | Structural compatibility is static and has boundaries | Paradigm shift | Generic assignability test and Exercise 3 | Chapter 3: Domain modeling |
| P0 | Use asynchronous I/O safely | `async` maps directly to coroutines/tasks | Async functions return Promises with distinct scheduling and rejection behavior | False friend | Filesystem tests | Slice 6 |
| P0 | Select collection types | A dictionary is the default mapping | Objects, `Record`, `Map`, and `Set` have different semantics | False friend | Task collection tests and Exercise 3 | Chapter 3: Domain modeling |
| P1 | Preserve caller types with generics | A helper may discard detail as a base class or `Any` | Generic constraints retain each structural caller type | New mechanism | `findById` test and Exercise 3 | Chapter 3: Domain modeling |
| P1 | Use equality deliberately | Equality/truthiness are familiar | Prefer `===`; coercion and falsiness are consequential | False friend | Exercise 2 and identifier-equality test | Chapter 2: Values that look familiar |
| P1 | Respect numeric limits | Integers are arbitrary precision | `number` is IEEE-754; `bigint` is separate | Operational difference | Exercise 2 and opaque-ID test | Chapter 2: Values that look familiar |
| P1 | Organize a project | Imports are straightforward inclusion | ESM resolution and package metadata shape execution | Operational difference | Package-layout task | Slice 5 |
| P1 | Avoid `this` callback failures | Instance methods retain their receiver | `this` depends on call site | New mechanism | Callback bug repair | Slice 5 |

