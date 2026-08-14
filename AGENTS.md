# Agent Guidelines

## Project Overview

Prettier plugin that formats Hugo/Go template files. Peer dependency: `prettier ^3.0.0`. TypeScript source lives in `src/`, compiled output in `dist/`.

Supported extensions: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`.

> See [README.md](README.md) for project intent.

## Documentation

- Developer-facing docs live under [docs/develop](docs/develop).
- User-facing docs live under [docs/guidance](docs/guidance).
- Add new docs to the appropriate folder instead of the repository root.
- Keep this file in sync with any documentation or workflow changes.

## Architecture

Architecture and project structure details are centralized in [docs/develop/structure.md](docs/develop/structure.md).

## Commands

```bash
npm run build       # Build plugin artifacts with tsdown → dist/
npm test            # Run all fixture tests (Vitest)
npm run test:runtime # Build then import dist/index.mjs in plain Node ESM (packaging/runtime smoke test)
npm run coverage    # Tests with coverage report
npm run lint        # oxlint
npm run format      # prettier --write .
npm run build:watch # Watch-mode build
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

- **Idempotency is enforced**: formatting the output a second time must equal the first result; violations are test failures.
- **`oxlint` is the standard linter** — keep documentation and scripts aligned with `package.json` lint commands.
- **`<script>` / `<style>` blocks** containing `{{}}` become `GoUnformattable` nodes and must be preserved byte-for-byte.
- **Stack-based parser**: unmatched `{{end}}` blocks throw `Error("Missing end block.")` — cover new block types with an error fixture.
- **Consumer runtime differs from test runtime**: always run `npm run test:runtime` before release to catch ESM/CJS interop issues in `dist/`.

## Publishing

Publishing details are centralized in [docs/develop/publishing.md](docs/develop/publishing.md).

- Publishing is performed locally after verification; GitHub Releases do not trigger npm publishing.
- Run `npm run release:plugin` only after authenticating to npm locally.

## Plugin Option

| Option                     | Type    | Default | Effect                     |
| -------------------------- | ------- | ------- | -------------------------- |
| `goTemplateBracketSpacing` | boolean | `true`  | `{{ stmt }}` vs `{{stmt}}` |

## Documentation Upkeep

**When modifying `src/` files or `package.json`**, review and update this file before ending your turn. Keep commands, architecture, options, and pitfalls in sync with the implementation. Outdated documentation is treated as a bug.
