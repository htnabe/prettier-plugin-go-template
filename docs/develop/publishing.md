## Publishing

Publishing is performed locally after the release commit has reached `main`.
Creating a GitHub Release does not publish the package automatically.

- Registry: npm (`https://registry.npmjs.org`)
- Package: `@htnabe/prettier-plugin-go-template`
- Stable dist-tag: `latest`
- Prerelease dist-tag: `next`

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
6. After the PRs are merged, verify the release commit on `main` and authenticate to npm locally. Use an interactive login or an environment variable; never commit an npm token or an `.npmrc` containing credentials.

```bash
git checkout main
git pull --ff-only origin main
npm whoami --registry=https://registry.npmjs.org
```

7. Run the release checks locally before creating a tag or GitHub Release:

```bash
npm ci
npm run lint
npm test
npm run build
npm pack --dry-run
```

8. Publish the package locally. `release:plugin` runs the runtime build check and coverage before publishing. For a prerelease, add `--tag next` to the publish command.

```bash
npm run release:plugin
# npm publish --access public --tag next
```

9. Verify that npm serves the expected version. Only continue after this succeeds:

```bash
npm view @htnabe/prettier-plugin-go-template@0.0.3 version
```

10. Create and push the release tag from the verified `main` commit:

```bash
git checkout main
git pull --ff-only origin main
git tag v0.0.3
git push origin v0.0.3
```

11. Publish a GitHub Release for `v0.0.3` after the tag has been pushed:

```bash
gh release create v0.0.3 --verify-tag --generate-notes
```

## Guardrails

- Do not push directly to `dev` or `main` except in an explicit emergency approved by maintainers.
- Do not delete or move release tags in normal operation. If a release fails after tagging, prefer a follow-up patch release over rewriting tag history.
- Prefer `gh release create --generate-notes` so release notes are derived from GitHub history instead of hand-maintained text.
- Do not create or push the tag until local verification and npm publication have succeeded. This keeps failed package publication from requiring tag or release deletion.
