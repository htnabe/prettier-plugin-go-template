## Publishing

Publishing is automated from GitHub Actions when a GitHub Release is published.

- Workflow: [.github/workflows/publish.yaml](../../.github/workflows/publish.yaml)
- Trigger: release event with type `published`
- Tag rule: release tag must start with `v` and match `package.json` version after removing the leading `v`
- Registry: npm (`https://registry.npmjs.org`)
- Package: `@htnabe/prettier-plugin-go-template`

### Dist-tags

- Stable versions publish with dist-tag `latest`
- Prerelease versions (for example `0.1.0-beta.1`) publish with dist-tag `next`
- Optional override: set repository variable `NPM_PRERELEASE_DIST_TAG`

### Required repository setup

1. Create a GitHub Environment named `publish`
2. Keep workflow permissions that enable trusted publishing (`id-token: write`, `contents: read`)
3. Ensure npm trusted publishing (OIDC) is configured for this repository/package in npm settings
