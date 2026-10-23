# prettier-plugin-go-template

[![NPM Badge](https://img.shields.io/npm/v/@htnabe/prettier-plugin-go-template)](https://www.npmjs.com/package/@htnabe/prettier-plugin-go-template)
![codecov](https://codecov.io/gh/htnabe/prettier-plugin-go-template/branch/main/graph/badge.svg)
![license](https://img.shields.io/github/license/htnabe/prettier-plugin-go-template)
[<img src="https://badges.ws/npm/dt/@htnabe/prettier-plugin-go-template" />](https://www.npmjs.com/package/@htnabe/prettier-plugin-go-template)

A Prettier plugin for formatting Go and Hugo template files with comprehensive support for template syntax and intelligent HTML formatting.

This project is a fork of [NiklasPor/prettier-plugin-go-template](https://github.com/NiklasPor/prettier-plugin-go-template).

- **Package**: `@htnabe/prettier-plugin-go-template`
- **Requirements**: Node.js 26.0.0 or later and Prettier 3.

## Quick Start

See guidance docs:

- English: [Guidance](docs/guidance/guidance.en.md)
- Japanese: [ガイダンス](docs/guidance/guidance.ja.md)

## For Developers

Use Bun (version pinned in `package.json`) for package management and scripts,
alongside the latest Node.js 26.x patch release:

```bash
bun install --frozen-lockfile
bun run test
bun run build
```

See [AGENTS.md](AGENTS.md) for architecture, commands, and project structure.

See [docs/develop](docs/develop) for development documentation.

## License

MIT
