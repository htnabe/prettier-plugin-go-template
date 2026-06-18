# Agent Guidelines

## Project Overview

Prettier plugin that formats Hugo/Go template files. Peer dependency: `prettier ^3.0.0`. TypeScript source lives in `src/`, compiled output in `lib/`.

Supported extensions: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`.

> See [README.md](README.md) for project intent and [CHANGELOG.md](CHANGELOG.md) for version history.

## Architecture

Three-file core in [`src/`](src/):

| File                                                       | Role                                                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`src/parse.ts`](src/parse.ts)                             | Regex parser; builds AST (`GoRoot`, `GoBlock`, `GoInline`, `GoMultiBlock`, `GoUnformattable`) using a stack |
| [`src/index.ts`](src/index.ts)                             | Prettier plugin entry; printer switch, `embed()` flow, plugin option declaration                            |
| [`src/create-id-generator.ts`](src/create-id-generator.ts) | ULID factory used to alias Go template nodes during the HTML formatting pass                                |

**Formatting flow**: `parseGoTemplate()` → AST with aliased child IDs → `embed()` replaces IDs with formatted children → Prettier HTML parser → re-inject → final output.

## Commands

```bash
npm run build       # Compile TypeScript → lib/  (tsc --pretty)
npm test            # Run all fixture tests  (Jest + ESM flag)
npm run coverage    # Tests with coverage report
npm run lint        # tslint --project .
npm run format      # prettier --write .
npm run watch       # Watch-mode TypeScript compile
npm run watch:test  # Watch-mode Jest
```

> **Pre-commit**: `lefthook` runs `lint` + `format` in parallel on every commit. See [lefthook.yaml](lefthook.yaml).  
> **CI**: `npm ci && npm test` on PRs to `main`/`dev`. See [.github/workflows/test.yaml](.github/workflows/test.yaml).

## Testing

Fixture-based; test harness is [`src/index.spec.ts`](src/index.spec.ts).

Each test case is a subdirectory under [`src/tests/`](src/tests/):

```
src/tests/<test-name>/
  input.html     # template to format
  expected.html  # expected output — or Error("message") to assert a thrown error
  config.json    # optional: plugin option overrides (e.g. {"goTemplateBracketSpacing": false})
```

All subdirectories are **auto-discovered** — no manual registration. A **second format pass** is always run; it must produce identical output (idempotency check).

**To add a test**: create the folder with `input.html` and `expected.html`, then `npm test`.

## Key Pitfalls

- **`NODE_OPTIONS=--experimental-vm-modules` is required** — already in npm scripts; do not remove this flag.
- **Idempotency is enforced**: formatting the output a second time must equal the first result; violations are test failures.
- **`tslint` is intentionally used** — do not migrate to ESLint unless explicitly asked.
- **`<script>` / `<style>` blocks** containing `{{}}` become `GoUnformattable` nodes and must be preserved byte-for-byte.
- **Stack-based parser**: unmatched `{{end}}` blocks throw `Error("Missing end block.")` — cover new block types with an error fixture.
- **`release:coverage` script is undefined** — `release:plugin` will fail at that step; add the script before publishing.

## Plugin Option

| Option                     | Type    | Default | Effect                     |
| -------------------------- | ------- | ------- | -------------------------- |
| `goTemplateBracketSpacing` | boolean | `true`  | `{{ stmt }}` vs `{{stmt}}` |

## Documentation Upkeep

**When modifying `src/` files or `package.json`**, review and update this file before ending your turn. Keep commands, architecture, options, and pitfalls in sync with the implementation. Outdated documentation is treated as a bug.
