# oxlint + oxfmt + Husky Design

## Overview

Add oxlint (linting), oxfmt (formatting), and Husky precommit hooks to the exist-sdk TypeScript project.

## Stack

- **oxlint** — linting
- **oxfmt** — formatting
- **Husky** — precommit hook
- **Package manager** — Yarn (PnP)

## Scope

All TypeScript files: `src/`, `tests/`, `scripts/`

## Installation

```sh
yarn add -D husky oxlint oxfmt
npx husky init
```

## Configuration Files

### `.oxlintrc` (project root)

Lint rules. See oxlint docs for available rules.

### `.oxfmtrc` (project root)

Format rules. Key options:

- `indent` — indent style and size
- `lineWidth` — max line length

## Package.json Scripts

```json
{
  "lint": "oxlint",
  "format:check": "oxfmt --check",
  "precommit": "yarn lint && yarn format:check"
}
```

## Precommit Hook

`.husky/pre-commit`:

```
yarn precommit
```

Runs lint + format check on all staged files. No `--cached` flags — full check is appropriate for this repo size.

## Files to Add/Modify

- `.oxlintrc`
- `.oxfmtrc`
- `package.json` (scripts)
- `.husky/pre-commit`
