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

Three-file core in [`src/`](src/):

| File                                                       | Role                                                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`src/parse.ts`](src/parse.ts)                             | Regex parser; builds AST (`GoRoot`, `GoBlock`, `GoInline`, `GoMultiBlock`, `GoUnformattable`) using a stack |
| [`src/index.ts`](src/index.ts)                             | Prettier plugin entry; printer switch, `embed()` flow, plugin option declaration                            |
| [`src/create-id-generator.ts`](src/create-id-generator.ts) | ULID factory used to alias Go template nodes during the HTML formatting pass                                |

**Formatting flow**: `parseGoTemplate()` → AST with aliased child IDs → `embed()` replaces IDs with formatted children → Prettier HTML parser → re-inject → final output.

## Commands

```bash
npm run build       # Build plugin artifacts with tsdown → dist/
npm test            # Run all fixture tests (Jest + ts-jest ESM preset + VM modules flag)
npm run coverage    # Tests with coverage report
npm run lint        # oxlint
npm run format      # prettier --write .
npm run build:watch # Watch-mode build
npm run watch:test  # Watch-mode Jest
npm run release:coverage # Coverage-only release helper
npm run release:plugin   # Build + coverage + npm publish
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
