# GitHub CI for npm + JSR Publishing — Design

**Date:** 2026-04-13
**Status:** Approved

## Overview

Automated CI/CD pipeline that lints, tests, and publishes `@fromo/exist-sdk` to both npm and JSR on every version bump detected via conventional commits.

---

## Workflow Architecture

```
[push to main (after PR merge)]
         │
         ▼
   CI job (runs on every push)
   ├── lint (oxlint)
   ├── format check (oxfmt --check)
   ├── typecheck (tsc --noEmit)
   └── tests (vitest run)
         │
         ▼
   Release job (runs only on main push, after CI passes)
   ├── semantic-release analyzes conventional commits
   │      └── no scope bump → silent exit (no publish)
   └── scope bump detected
            │
            ├── npm publish @fromo/exist-sdk
            │      └── dist-tag: latest (stable) | next (pre-release)
            │
            ├── jsr publish @fromo/exist-sdk
            │      └── --dist-tag latest | next
            │      └── --pre-release flag for pre-releases
            │
            └── git tag + GitHub Release created
```

---

## Files to Create

### `.github/workflows/release.yml`

Single workflow with two jobs:

**`ci` job** — runs on every push (including PRs)

- Runs: lint, format check, typecheck, tests
- Fails fast on first failure
- Required gate for the release job

**`release` job** — runs only on push to `main` (not PRs)

- Depends on: `ci`
- Condition: `github.event_name == 'push' && github.ref == 'refs/heads/main'`
- Uses: semantic-release
- Auth: Token-based (NPM_TOKEN + JSR_TOKEN secrets — see Authentication section)

**Permissions (required for git tag creation):**

```yaml
permissions:
  contents: write # needed for git tag creation
```

**Concurrency:**

```yaml
concurrency:
  group: release
  cancel-in-progress: true
```

Prevents double-publishes if two releases are pushed simultaneously.

---

### `release.config.js`

Uses `"type": "module"`, so uses `.js` extension with `export default`.

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
        // Sync version from semantic-release into deno.json before JSR publish
        prepareCmd:
          "deno run -A jsr:@jsr/octane publish --dry-run --version ${nextRelease.version} 2>/dev/null || true",
      },
    ],
    [
      "@semantic-release/exec",
      {
        // Actually publish to JSR with the resolved version
        publishCmd:
          'deno run -A jsr:@jsr/octane publish --token "$JSR_TOKEN" --version ${nextRelease.version}',
      },
    ],
    "@semantic-release/git",
  ],
};
```

**Version check** is implicit — `@semantic-release/commit-analyzer` with default preset (`angular`) only increments version when a commit contains a breaking change indicator (`!`), a `feat`, `fix`, or other recognized type with a scope bump. No commit = no publish.

---

### `deno.json`

Required at project root for JSR publishing. Synced version is handled by the exec plugin calling octane with `--version`.

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

**Publishing surface:** `src/index.ts` and `src/types.ts` are the only published files. The `deno.json` `"exports"` points to the source directly — no build step required if the source is Node-free. If Node-specific imports appear in the future, a build step must be added before JSR publish.

---

## npm Publishing

**Package name:** `@fromo/exist-sdk`
**Registry:** npmjs.com

**dist-tags:**

- `latest` — stable releases (commits: `feat`, `fix`, `perf`, etc.)
- `next` — pre-releases (commits: `feat!`, `fix!`, `alpha`, `beta`, `next`, scope with `!`)

Handled by `@semantic-release/npm` plugin. `package.json` `name` must be set to `@fromo/exist-sdk` before the first release.

---

## JSR Publishing

**Package name:** `@fromo/exist-sdk`
**Registry:** jsr.io

Uses `@jsr/octane` CLI called via `deno run -A jsr:@jsr/octane`. Authentication uses `JSR_TOKEN` secret passed via environment variable `JSR_TOKEN`.

```sh
deno run -A jsr:@jsr/octane publish --token "$JSR_TOKEN" --version ${nextRelease.version}
```

**Pre-release flow:** When `nextRelease.version` contains `alpha`, `beta`, or `rc`, octane automatically treats it as a pre-release. The `--dist-tag next` flag maps pre-releases to JSR's `next` channel.

**Note:** JSR does not have a native `next` dist-tag equivalent — pre-releases are identified by version string suffix (`-alpha.1`, `-beta.2`, etc.). Both registries will carry the same version string; consumers on JSR import via `jsr:@fromo/exist-sdk@^<version>`.

---

## Authentication (Tokens)

Both npm and JSR use classic token-based authentication via GitHub Actions secrets.

| Secret      | Purpose        | Scope                                                                    |
| ----------- | -------------- | ------------------------------------------------------------------------ |
| `NPM_TOKEN` | npm publishing | npmjs.com → Account Settings → Tokens → Generate Classic Token (Publish) |
| `JSR_TOKEN` | JSR publishing | jsr.io → Settings → Access Tokens → Create                               |

Both secrets must be added to the repository at **Settings → Secrets and Variables → Actions**.

The workflow passes `NPM_TOKEN` via `@semantic-release/npm` plugin (reads from environment). `JSR_TOKEN` is passed explicitly in the `release` job's `env` block and consumed by the `jsr:@jsr/octane publish` command.

---

## Semantic Versioning Rules

Based on Angular conventional commits preset:

| Commit type                               | Version bump | npm dist-tag | JSR pre-release |
| ----------------------------------------- | ------------ | ------------ | --------------- |
| `feat`                                    | minor        | `latest`     | no              |
| `fix`                                     | patch        | `latest`     | no              |
| `perf`                                    | patch        | `latest`     | no              |
| `feat!`, `fix!`, any `!`                  | major        | `latest`     | no              |
| `feat(alpha)`, `feat(beta)`, `feat(next)` | minor        | `next`       | yes             |
| `fix(alpha)`, `fix(beta)`, `fix(next)`    | patch        | `next`       | yes             |

The version check is enforced by semantic-release — if no commit triggers a bump, nothing publishes.

---

## First Release Checklist

Before the first `main` push triggers a release:

1. Change `package.json` `name` to `@fromo/exist-sdk`
2. Add `deno.json` at project root
3. Add `NPM_TOKEN` and `JSR_TOKEN` secrets to GitHub repo (**Settings → Secrets and Variables → Actions**)
4. Ensure `main` branch has at least one `feat:` or `fix:` commit to trigger the first release

---

## Implementation Tasks

1. Update `package.json` `name` field to `@fromo/exist-sdk`
2. Create `deno.json` at project root
3. Install semantic-release plugins: `npm install --save-dev semantic-release @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/npm @semantic-release/exec @semantic-release/git`
4. Create `.github/workflows/release.yml`
5. Create `release.config.js`
6. Add `NPM_TOKEN` and `JSR_TOKEN` secrets to GitHub repository
7. Verify CI passes on a PR before merging
