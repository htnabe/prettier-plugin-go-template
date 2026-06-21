---
name: git-commit-push-pr
description: "Create commits with conventional commits and gitemoji, push when permission is granted, and create pull requests with gh using a PR template. Use when finishing changes and preparing review-ready delivery."
argument-hint: "Scope, branch, and PR target details"
user-invocable: true
---

# Git Commit, Push, and PR Workflow

## Outcome

- Create high-quality commits at meaningful granularity.
- Push only when permission exists.
- Create a pull request with gh and return only the review URL.
- Keep status summaries concise.

## When to Use

- Finalizing implementation work.
- Preparing changes for review.
- Standardizing commit and PR quality across contributors.

## Rules

- Use conventional commits with gitemoji.
- Preferred commit format:
  - fix(api): :wrench: short description
- Keep one commit per logical change when possible.
- If a commit contains multiple logical changes, list each change clearly in the commit message body.
- If uncertain about a decision, ask for guidance and stop before acting.
- Keep progress and final summaries minimal.

## Defaults

- Push permission default:
  - Push only when explicit permission appears in the current chat request.
  - If explicit permission is absent, do not push and ask for guidance.
- PR base branch default:
  - Ask for the base branch every time when it is not provided.
- Multi-change commit body default:
  - Use a bulleted list with short phrases.

## Procedure

1. Validate change scope.

- Confirm what should be included in this commit.
- If scope boundaries are unclear, ask for guidance before staging.

2. Group changes by meaningful granularity.

- Prefer one logical change per commit.
- If multiple changes must be included together, prepare a message body with a short list of included changes.

3. Review the diff before committing.

- Verify no unrelated files are included.
- If uncertainty exists about including a file, ask for guidance.

4. Create the commit message.

- Header pattern: type(scope): :gitemoji: summary
- Keep summary concise and specific.
- For multi-change commits, add a body with change bullets.

5. Create the commit.

- Commit only the intended staged changes.
- Re-check commit output and hash.

6. Decide whether to push.

- If explicit permission to push is present, push.
- If permission is missing or ambiguous, ask for guidance and do not push.

7. Create or verify PR template.

- Use repository template at .github/pull_request_template.md.
- If missing, create it before opening a PR.

8. Create PR with gh.

- Use gh pr create with target branch, title, and body from the template.
- If base branch, reviewers, or labels are unclear, ask for guidance first.

9. Return the review URL only.

- After PR creation, output only the PR review URL unless the user asks for more detail.

## Decision Gates

- Unknown commit scope: ask.
- Unsure file inclusion: ask.
- Push permission unclear: ask and stop.
- PR metadata unclear: ask.

## Quality Checks

- Commit title follows conventional commit plus gitemoji pattern.
- Commit granularity is meaningful.
- Multi-change commit includes explicit change list in body.
- Push happens only with permission.
- PR is created via gh and uses the template.
- Final response is concise and includes only the review URL when PR is created.
