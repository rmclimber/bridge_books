# Python -> TypeScript Book Plan

## Audience and scope

Experienced Python programmers moving into strict TypeScript for general
professional Node.js library and command-line work. The core book teaches the
language delta, professional workflow, and independent problem solving; it is
not a framework, browser, database, or deployment course.

## Approved outcomes

Readers will be able to work in a strict TypeScript project, distinguish the
compile-time type system from JavaScript runtime behavior, model and validate
data safely, use ESM modules and idiomatic TypeScript structures, implement
async Node I/O, and test/debug a modest professional change.

## Assessment design

The capstone is a typed local task-tracking library and CLI. It imports and
validates persisted JSON, represents domain state with discriminated unions,
performs asynchronous persistence, and is covered by unit and integration
tests. The independent exit assessment adds a data variant, migration, bug fix,
async feature, tests, and a written explanation of key diagnostics and runtime
boundaries.

## Page budget

The reader-facing book is provisionally 52--64 pages, including in-chapter
exercises. A separate solutions workbook is provisionally 25--35 pages;
appendices are outside those estimates.

## Slice order

1. Reproducible foundation.
2. Runtime boundaries: erased types, `unknown`, validation, and narrowing.
3. Absence, equality, numeric limits, and mutation.
4. Domain modeling: unions, collections, generics, and structural typing.
5. Modules, functions/classes, `this`, and program structure.
6. Promises, asynchronous persistence, errors, and tests.
7. Capstone integration.
8. Exit assessment and production pass.

