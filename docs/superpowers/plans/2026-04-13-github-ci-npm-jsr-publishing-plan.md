# GitHub CI for npm + JSR Publishing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automated CI/CD pipeline that lints, tests, and publishes `@fromo/exist-sdk` to both npm and JSR on version bumps detected via conventional commits.

**Architecture:** Single GitHub Actions workflow with two jobs: `ci` (lint/typecheck/test on every push) and `release` (semantic-release on push to main, publishes to npm + JSR via OIDC, no token secrets). Semantic-release drives versioning from conventional commits; `@semantic-release/exec` calls `@jsr/octane` for JSR publish.

**Tech Stack:** GitHub Actions, semantic-release (with npm, exec, git plugins), `@jsr/octane`, Deno, npm (via OIDC)

---

## File Map

| File                            | Action | Purpose                                                           |
| ------------------------------- | ------ | ----------------------------------------------------------------- |
| `package.json`                  | Modify | Change `name` to `@fromo/exist-sdk`, add semantic-release plugins |
| `deno.json`                     | Create | JSR package manifest at project root                              |
| `.github/workflows/release.yml` | Create | CI + release GitHub Actions workflow                              |
| `release.config.js`             | Create | Semantic-release configuration                                    |

---

## Pre-conditions

- GitHub repo exists and is writable by CI
- Repository has OIDC enabled at repo or environment level for npm publishing
- User will manually create the `npm` GitHub environment with OIDC enabled (not codeable)

---

## Task 1: Update package.json name and add semantic-release plugins

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Update package.json name and add devDependencies**

```json
"devDependencies": {
  "@types/node": "^25.6.0",
  "@semantic-release/commit-analyzer": "^13.0.0",
  "@semantic-release/exec": "^6.0.0",
  "@semantic-release/git": "^10.0.0",
  "@semantic-release/npm": "^12.0.0",
  "@semantic-release/release-notes-generator": "^14.0.0",
  "husky": "^9.1.7",
  "openapi-typescript": "^7.13.0",
  "oxfmt": "^0.44.0",
  "oxlint": "^1.59.0",
  "semantic-release": "^24.0.0",
  "tsx": "^4.21.0",
  "typescript": "^6.0.2",
  "vitest": "^4.1.4"
}
```

Run: `yarn add --dev semantic-release @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/npm @semantic-release/exec @semantic-release/git`

- [ ] **Step 2: Change package name to @fromo/exist-sdk**

In `package.json`, change `"name": "exist-sdk"` to `"name": "@fromo/exist-sdk"`.

- [ ] **Step 3: Add release script**

Add to `scripts` in `package.json`:

```json
"release": "semantic-release"
```

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: rename to @fromo/exist-sdk and add semantic-release plugins

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create deno.json for JSR publishing

**Files:**

- Create: `deno.json`

- [ ] **Step 1: Create deno.json at project root**

```json
{
  "name": "@fromo/exist-sdk",
  "version": "0.1.0",
  "exports": "./src/index.ts",
  "publish": {
    "registry": "https://jsr.io",
    "exclude": ["**/*.test.ts", "**/*.test-d.ts", "**/test/**", "scripts/**"]
  }
}
```

**Note:** `version` in `deno.json` must match `package.json` version. For the `release` workflow, semantic-release updates `package.json` version, then the exec plugin passes `${nextRelease.version}` to `jsr:@jsr/octane publish --version`. The `deno.json` version field is for display purposes — JSR reads the version from the `--version` flag at publish time, not from the file.

- [ ] **Step 2: Commit**

```bash
git add deno.json
git commit -m "chore: add deno.json for JSR publishing

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Create release.config.js

**Files:**

- Create: `release.config.js`

- [ ] **Step 1: Create release.config.js**

```js
/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "@semantic-release/exec",
      {
        // Publish to JSR with OIDC authentication (--github flag)
        publishCmd: "deno run -A jsr:@jsr/octane publish --github --version ${nextRelease.version}",
      },
    ],
    "@semantic-release/git",
  ],
};
```

**Note:** The `--github` flag in `jsr:@jsr/octane publish` triggers OIDC authentication automatically. Combined with `permissions: id-token: write` in the GitHub Actions workflow, no `JSR_TOKEN` secret is needed.

- [ ] **Step 2: Commit**

```bash
git add release.config.js
git commit -m "chore: add semantic-release configuration

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Create .github/workflows/release.yml

**Files:**

- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create .github/workflows/release.yml**

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - run: yarn install --immutable
        env:
          NPM_CONFIG_UPDATE_NOTIFIER: "false"

      - run: yarn lint
      - run: yarn format:check
      - run: yarn typecheck
      - run: yarn test:run

  release:
    name: Release
    runs-on: ubuntu-latest
    needs: ci
    # Only run on push to main (after PR merge), not on PRs
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: write # for git tag creation
      id-token: write # for OIDC token exchange (npm + JSR)
    concurrency:
      group: release
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - run: yarn install --immutable
        env:
          NPM_CONFIG_UPDATE_NOTIFIER: "false"

      - run: yarn release
        env:
          # OIDC: npm-publish action handles token exchange automatically
          NPM_CONFIG_UPDATE_NOTIFIER: "false"
```

**Notes:**

- `yarn release` runs `semantic-release`. The npm plugin in `release.config.js` uses OIDC automatically when running in a GitHub Actions environment with `id-token: write` permission.
- `NPM_CONFIG_UPDATE_NOTIFIER: "false"` suppresses npm's "new version available" noise in CI logs.
- The `npm` environment with OIDC enabled must be created manually in GitHub repo settings — see Task 6.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow with semantic-release

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Manual setup — npm OIDC environment

This task cannot be automated via code. It requires manual action in the GitHub web UI.

**Files:** None (GitHub UI only)

- [ ] **Step 1: Create npm environment in GitHub repo settings**

1. Go to repository **Settings** → **Environments** → **Create environment**
2. Name it `npm`
3. Under **Environment settings**, enable **Enable OIDC token**
4. Optionally set **Environment protection rules** (e.g., require review) — not required for the pipeline to work
5. Click **Save protection rules**

- [ ] **Step 2: Add environment reference to workflow (optional enhancement)**

The workflow as written uses repository-level OIDC. If npm publish fails, add `environment: npm` to the `release` job:

```yaml
release:
  ...
  environment: npm  # references the npm environment with OIDC enabled
```

---

## Task 6: First-release verification

**Files:** None

- [ ] **Step 1: Verify workflow runs on a PR before merging**

Push a test branch with a `feat:` commit and open a PR. Verify:

- `ci` job runs lint, format check, typecheck, and tests
- All steps pass

- [ ] **Step 2: Verify first release triggers on merge to main**

After merging a PR with a `feat:` or `fix:` commit to `main`:

- The `release` job should run
- Semantic-release should create a git tag and GitHub release
- `@fromo/exist-sdk` should appear on npmjs.com with `latest` dist-tag
- `@fromo/exist-sdk` should appear on jsr.io

If the release job does not run, check:

- `github.ref == 'refs/heads/main'` condition is correct
- CI job passed (release depends on ci)
- The commit message follows conventional commits format

---

## Spec Coverage Check

| Spec Section                    | Task       |
| ------------------------------- | ---------- |
| CI job (lint/typecheck/test)    | Task 4     |
| Release job (semantic-release)  | Task 4     |
| OIDC permissions                | Task 4     |
| Concurrency group               | Task 4     |
| npm publish                     | Tasks 1, 4 |
| JSR publish via octane --github | Tasks 2, 3 |
| Semantic-release config         | Task 3     |
| deno.json                       | Task 2     |
| package.json rename             | Task 1     |
| npm OIDC environment setup      | Task 5     |
| First-release checklist         | Task 6     |

All spec requirements are covered. No placeholder steps, no TODOs.
