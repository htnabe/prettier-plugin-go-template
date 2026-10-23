# Agent Guidelines

## Project Overview

Prettier plugin that formats Hugo/Go template files. Peer dependency: `prettier ^3.0.0`. TypeScript source lives in `src/`, compiled output in `dist/`.

Supported extensions: `.go.html`, `.gohtml`, `.gotmpl`, `.go.tmpl`, `.tmpl`, `.tpl`, `.html.tmpl`, `.html.tpl`.

Requires Node.js 26.0.0 or later. Use the latest Node.js 26.x patch release for
development and publishing; the dev container also uses Node.js 26.
Node.js 20, 22, and 24 are no longer supported.

Use Bun for dependency management and package scripts, with the version pinned in
`package.json` (`packageManager`). The dev container installs the same Bun version.
Commit `bun.lock`; do not generate npm, Yarn, or pnpm lockfiles.
Run `bun install --frozen-lockfile` for setup and CI, or `bun install` after
dependency changes. `bunfig.toml` disables install lifecycle scripts and enforces
a seven-day minimum release age for newly resolved packages.
Keep Node.js for executing development tools and verifying consumer compatibility;
Bun is the package manager, not a replacement test runner.

> See [README.md](README.md) for project intent.

## Documentation

- Developer-facing docs live under [docs/develop](docs/develop).
- User-facing docs live under [docs/guidance](docs/guidance).
- Add new docs to the appropriate folder instead of the repository root.
- Keep this file in sync with any documentation or workflow changes.

## Architecture

Architecture and project structure details are centralized in [docs/develop/structure.md](docs/develop/structure.md).
Core source folders under `src/` are `config/`, `parser/`, `printer/`, `types/`, `utils/`, and `tests/`; `src/index.ts` remains the plugin entrypoint.

## Commands

```bash
bun run build       # Build plugin artifacts with tsdown → dist/
bun run test        # Run all fixture tests (Vitest, not bun test)
bun run test:runtime # Build then import dist/index.mjs in plain Node ESM (packaging/runtime smoke test)
bun run coverage    # Tests with coverage report
bun run lint        # oxlint
bun run format      # prettier --write .
bun run build:watch # Watch-mode build
bun run release:coverage # Coverage-only release helper
bun run release:plugin   # Legacy local publish helper; use Publish Release workflow
```

> **Pre-commit**: `lefthook` runs `lint` + `format` in parallel on every commit. See [lefthook.yaml](lefthook.yaml).  
> **CI**: Node.js `26.0.0` and `26.x` on PRs to `main`/`dev`, with Bun pinned by `package.json`, running `bun install --frozen-lockfile`, `bun run lint`, `bun run coverage`, and `bun run test:runtime`. Coverage is uploaded only from `26.x`. See [.github/workflows/test.yaml](.github/workflows/test.yaml).

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

**To add a test**: create the folder with `input.html` and `expected.html`, then `bun run test`.

## Key Pitfalls

- **Idempotency is enforced**: formatting the output a second time must equal the first result; violations are test failures.
- **`oxlint` is the standard linter** — keep documentation and scripts aligned with `package.json` lint commands.
- **`<script>` / `<style>` blocks** containing `{{}}` become `GoUnformattable` nodes and must be preserved byte-for-byte.
- **Stack-based parser**: unmatched `{{end}}` blocks throw `Error("Missing end block.")` — cover new block types with an error fixture.
- **Consumer runtime differs from test runtime**: always run `bun run test:runtime` before release to catch ESM/CJS interop issues in `dist/`.

## Publishing

Publishing details are centralized in [docs/develop/publishing.md](docs/develop/publishing.md).

- Publishing is performed by the `Publish Release` GitHub Actions workflow after a version bump reaches `main`.
- Git tags and GitHub Releases are created locally after the workflow publishes to npm.
- npm dist-tags are `latest` for stable releases, `beta` for beta prereleases, `rc` for release candidates, and `next` for other prereleases.
- Configure npm trusted publishing for `.github/workflows/publish.yaml` before the first automated release.
- npm CLI usage is limited to release operations (`npm view`, `npm pack`, `npm publish`, and updating the publishing CLI). Keep npm for trusted publishing with OIDC and provenance.
- Do not run `bun run release:plugin` for normal releases; it remains as a legacy local publish helper.

## Plugin Option

| Option                     | Type    | Default | Effect                     |
| -------------------------- | ------- | ------- | -------------------------- |
| `goTemplateBracketSpacing` | boolean | `true`  | `{{ stmt }}` vs `{{stmt}}` |

## Documentation Upkeep

**When modifying `src/` files or `package.json`**, review and update this file before ending your turn. Keep commands, architecture, options, and pitfalls in sync with the implementation. Outdated documentation is treated as a bug.
