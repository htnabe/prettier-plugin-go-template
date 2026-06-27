# Agent Guidelines

## Project Overview

Prettier plugin that formats Hugo/Go template files. Peer dependency: `prettier ^3.0.0`. TypeScript source lives in `src/`, compiled output in `dist/`.

Supported extensions: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`.

> See [README.md](README.md) for project intent and [CHANGELOG.md](CHANGELOG.md) for version history.

## Documentation

- Developer-facing docs live under [docs/develop](docs/develop).
- User-facing docs live under [docs/guidance](docs/guidance).
- Add new docs to the appropriate folder instead of the repository root.
- Keep this file in sync with any documentation or workflow changes.

## Architecture

Modular core under [`src/`](src/):

| Path                                            | Role                                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`src/index.ts`](src/index.ts)                  | Plugin entrypoint; exports `languages`, `options`, `parsers`, and `printers`       |
| [`src/config/`](src/config)                     | Plugin constants, language registration, and user option definitions               |
| [`src/features/parser/`](src/features/parser)   | Parser orchestration (`parsers.ts`) and regex AST builder (`parse-go-template.ts`) |
| [`src/features/printer/`](src/features/printer) | Printer orchestration (`printers.ts`) and printer helper utilities                 |
| [`src/types/`](src/types)                       | AST and option types (`src/types/ast/ast.ts`, guards, parser-option interfaces)    |
| [`src/utils/`](src/utils)                       | Shared utility helpers such as ULID ID generation and collection helpers           |

**Formatting flow**: parser in `src/features/parser/parse-go-template.ts` builds aliased AST → printer `embed()` in `src/features/printer/printers.ts` maps IDs back to formatted children through Prettier HTML → final document output.

## Commands

```bash
npm run build       # Build plugin artifacts with tsdown → dist/
npm test            # Run all fixture tests (Jest + ts-jest ESM preset + VM modules flag)
npm run test:runtime # Build then import dist/index.mjs in plain Node ESM (packaging/runtime smoke test)
npm run coverage    # Tests with coverage report
npm run lint        # oxlint
npm run format      # prettier --write .
npm run build:watch # Watch-mode build
npm run watch:test  # Watch-mode Jest
npm run release:coverage # Coverage-only release helper
npm run release:plugin   # Runtime smoke test + coverage + npm publish
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

- **`NODE_OPTIONS=--experimental-vm-modules` is currently required** by the Jest + Prettier runtime path in this repo; do not remove without replacing the test runner/config strategy.
- **Idempotency is enforced**: formatting the output a second time must equal the first result; violations are test failures.
- **`oxlint` is the standard linter** — keep documentation and scripts aligned with `package.json` lint commands.
- **`<script>` / `<style>` blocks** containing `{{}}` become `GoUnformattable` nodes and must be preserved byte-for-byte.
- **Stack-based parser**: unmatched `{{end}}` blocks throw `Error("Missing end block.")` — cover new block types with an error fixture.
- **Consumer runtime differs from Jest runtime**: always run `npm run test:runtime` before release to catch ESM/CJS interop issues in `dist/`.

## Publishing

- Release workflow is [.github/workflows/publish.yaml](.github/workflows/publish.yaml).
- Trigger: GitHub release `published`, gated to `v*` tags that match `package.json` version after removing `v`.
- Publish target: npm package `@htnabe/prettier-plugin-go-template` with trusted publishing (OIDC).
- Dist-tags: stable releases use `latest`; prereleases default to `next` and can be overridden with `NPM_PRERELEASE_DIST_TAG` repository variable.
- GitHub Environment `publish` must exist for the workflow job.

## Plugin Option

| Option                     | Type    | Default | Effect                     |
| -------------------------- | ------- | ------- | -------------------------- |
| `goTemplateBracketSpacing` | boolean | `true`  | `{{ stmt }}` vs `{{stmt}}` |

## Documentation Upkeep

**When modifying `src/` files or `package.json`**, review and update this file before ending your turn. Keep commands, architecture, options, and pitfalls in sync with the implementation. Outdated documentation is treated as a bug.
