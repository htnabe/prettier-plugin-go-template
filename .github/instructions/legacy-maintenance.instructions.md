---
applyTo: "src/**"
description: "Use when: maintaining, debugging, or extending the parser, AST types, printer, or test fixtures in this Hugo Prettier plugin. Includes compatibility guardrails for an aging codebase."
---

# Source File Conventions

## Compatibility-First Policy

- Run `npm test` after every change. All existing fixtures must pass before adding or changing anything.
- Do not remove or rename AST node types or type guards (`isInline()`, `isBlock()`, etc.) without updating every reference in both `parse.ts` and `index.ts`.
- Do not change the node aliasing scheme (ULID IDs in `aliasNodeContent`) without tracing every downstream reference in the `embed()` function.

## Parser Regex (`parse.ts`)

The central regex near the top of the file captures `{{...}}` blocks with optional whitespace-trim (`-`), comment, and raw delimiters. Changes here affect every node type in the AST:

- Run the full test suite after any regex change; regression risk is high.
- Any new delimiter variant requires a matching `GoInlineStartDelimiter` / `GoInlineEndDelimiter` union type update **and** a new fixture under `src/tests/`.

## Adding AST Node Types

1. Define the new type extending `GoBaseNode<Type>` in `parse.ts`.
2. Add a type guard `isXxx()`.
3. Add a printer case in the `switch` in `index.ts` and implement `printXxx()`.
4. Create a fixture folder `src/tests/<feature-name>/` with `input.html` and `expected.html`.

## Outdated Tooling — Do Not Auto-Migrate

| Tool                                     | Status                  | Action                                               |
| ---------------------------------------- | ----------------------- | ---------------------------------------------------- |
| `tslint`                                 | Deprecated upstream     | Do not migrate to ESLint unless explicitly requested |
| `typescript ^6.0.3`                      | Pre-release             | Avoid assumptions about stable API surface           |
| `NODE_OPTIONS=--experimental-vm-modules` | Required workaround     | Do not remove from test scripts                      |
| `codecov ^3.8.3`                         | Has deprecation notices | Treat warnings as non-blocking                       |

## Prettier Ignore Support

Two mechanisms must remain working at all times:

- **Line-level**: `<!-- prettier-ignore -->` and `{{ prettier-ignore }}`
- **Block-level**: `{{ prettier-ignore-start }}` … `{{ prettier-ignore-end }}`

Cover both in the relevant fixture tests if you touch ignore-handling code.

## Debugging Formatting Regressions

1. Reproduce with the smallest possible `input.html`.
2. Create a fixture folder immediately — it becomes the regression test automatically.
3. Inspect in order: `aliasNodeContent()` round-trip → `embed()` child reinsertion → `printStatement()` bracket spacing.

## Documentation Upkeep

After any change to commands, architecture, plugin options, or pitfalls, update [`AGENTS.md`](../../AGENTS.md) before ending your turn.
