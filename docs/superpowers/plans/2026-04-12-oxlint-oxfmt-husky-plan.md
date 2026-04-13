# oxlint + oxfmt + Husky Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and configure oxlint, oxfmt, and Husky precommit hooks for the exist-sdk TypeScript project.

**Architecture:** Add linting (oxlint), formatting (oxfmt), and precommit hooks (Husky). All TypeScript in `src/`, `tests/`, and `scripts/` are in scope. Simple direct hook approach — no lint-staged, full check on precommit.

**Tech Stack:** oxlint, oxfmt, Husky, Yarn (PnP)

---

### Task 1: Install dependencies and initialize Husky

- [ ] **Step 1: Install oxlint, oxfmt, and husky as dev dependencies**

Run: `yarn add -D husky oxlint oxfmt`

Expected: Packages added to `package.json` devDependencies

- [ ] **Step 2: Initialize Husky**

Run: `npx husky init`

Expected: `.husky/` directory created with `pre-commit` hook file

- [ ] **Step 3: Verify husky init**

Run: `cat .husky/pre-commit`

Expected: `yarn precommit` (or similar hook entry)

---

### Task 2: Create oxlint config

- [ ] **Step 1: Create `.oxlintrc` with sensible defaults**

```json
{
  "rules": {
    "noImplicitAny": "warn",
    "noUnusedLocals": "warn",
    "noUnusedParameters": "warn"
  }
}
```

Run: Write to `.oxlintrc` in project root

- [ ] **Step 2: Verify config is valid**

Run: `yarn oxlint --version` (or equivalent)

Expected: Tool runs without error

---

### Task 3: Create oxfmt config

- [ ] **Step 1: Create `.oxfmtrc` matching project conventions**

```json
{
  "indent": {
    "kind": "IndentWithSpaces",
    "size": 2
  },
  "lineWidth": 120
}
```

Run: Write to `.oxfmtrc` in project root

Note: `indent.size: 2` matches the existing `tsconfig.json` style

- [ ] **Step 2: Verify config is valid**

Run: `yarn oxfmt --version` (or equivalent)

Expected: Tool runs without error

---

### Task 4: Add scripts to package.json

- [ ] **Step 1: Add lint, format:check, and precommit scripts to package.json**

```json
{
  "scripts": {
    "lint": "oxlint",
    "format:check": "oxfmt --check",
    "precommit": "yarn lint && yarn format:check"
  }
}
```

Run: Edit `package.json` — add `"lint"`, `"format:check"`, and `"precommit"` scripts

---

### Task 5: Update precommit hook

- [ ] **Step 1: Replace `.husky/pre-commit` content**

```sh
yarn precommit
```

Run: Write to `.husky/pre-commit`

- [ ] **Step 2: Verify hook is executable**

Run: `ls -la .husky/pre-commit`

Expected: `-rwxr-xr-x` permissions

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Run the precommit check manually**

Run: `yarn precommit`

Expected: Pass with no errors (or list of issues if files need formatting/linting)

- [ ] **Step 2: If issues found, fix them**

Run: `yarn lint --fix` and `yarn format:check --write` (or equivalent fix flags)

- [ ] **Step 3: Commit**

```bash
git add .husky/pre-commit .oxlintrc .oxfmtrc package.json
git commit -m "chore: add oxlint, oxfmt, and Husky precommit hook"
```

---
