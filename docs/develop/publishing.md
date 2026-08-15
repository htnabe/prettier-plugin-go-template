## Publishing

Publishing is performed by GitHub Actions after a version bump reaches `main`.
Git tags and GitHub Releases are created locally after npm publish succeeds.

- Registry: npm (`https://registry.npmjs.org`)
- Package: `@htnabe/prettier-plugin-go-template`
- Stable dist-tag: `latest`
- General prerelease dist-tag: `next`
- Beta prerelease dist-tag: `beta`
- Release candidate dist-tag: `rc`

The workflow selects the dist-tag from the first prerelease identifier:

| Version         | Dist-tag |
| --------------- | -------- |
| `1.0.0`         | `latest` |
| `1.1.0-alpha.1` | `next`   |
| `1.1.0-beta.1`  | `beta`   |
| `1.1.0-rc.1`    | `rc`     |

Install a specific channel with an explicit tag, for example
`npm install @htnabe/prettier-plugin-go-template@beta`.

## Release Procedure

1. Start from a release branch (for example `release/v0.0.3`).
2. Update version files without creating a tag:

```bash
npm version 0.0.3 --no-git-tag-version
```

3. Commit release changes on the release branch.
4. Create and merge PRs in this order:
   - `release/v0.0.3` -> `dev`
   - `dev` -> `main`
5. Do not push directly to `dev` or `main`. Release changes must reach both branches through PR merges.
6. After the PRs are merged, the `Publish Release` workflow runs automatically.
   It only publishes when the `package.json` version differs from the previous
   `main` commit, matches `package-lock.json`, and is not already published on
   npm. Ordinary `main` changes therefore do not create releases.

   The workflow uses npm trusted publishing via OIDC. Configure the package's
   trusted publisher for this repository and `.github/workflows/publish.yaml` on
   npm before the first automated release.

7. Run the release checks locally before merging the release PR:

```bash
npm ci
npm run lint
npm test
npm run build
npm pack --dry-run
```

8. After the workflow publishes the package successfully, create and push the
   release tag locally from the same `main` commit, then create the GitHub
   Release:

```bash
git checkout main
git pull --ff-only origin main
VERSION=$(node -p "require('./package.json').version")
git tag "v${VERSION}"
git push origin "v${VERSION}"
gh release create "v${VERSION}" --verify-tag --generate-notes --title "v${VERSION}"
```

Tags must never be created before validation and npm publication.

## Guardrails

- Do not push directly to `dev` or `main` except in an explicit emergency approved by maintainers.
- Do not delete or move release tags in normal operation. If a release fails after tagging, prefer a follow-up patch release over rewriting tag history.
- Prefer `gh release create --generate-notes` so release notes are derived from GitHub history instead of hand-maintained text.
- Do not create or push the tag before npm publication has succeeded. This keeps failed package publication from requiring tag or release deletion.
- Do not reuse a version that has already been published to npm. Fix the release commit and use a new version when npm publication has succeeded but the package contents are wrong.
