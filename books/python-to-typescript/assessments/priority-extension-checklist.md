# Priority assessment checklist

- Read the fixture as JSON, not as a TypeScript object.
- Find the trusted `Task` construction at the persistence boundary.
- Write a parser test before changing the command switch.
- Use a rejecting file port for the failed-save test.
- Run `pnpm run check` before consulting the workbook.
