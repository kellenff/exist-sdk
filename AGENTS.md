# AGENTS.md

This file provides guidance to coding agents (https://agents.md/) when working with code in this repository.

## Project Overview

Pre-alpha SDK for [Exist.io](https://exist.io/) HTTP API. No installable package or stable API surface yet — the repo currently holds documentation scaffolding and an OpenAPI spec.

## Package Manager

Yarn 4.13.0 with **zero-installs** (PnP mode). Yarn is committed to the repo at `.yarn/releases/yarn-4.13.0.cjs`.

```bash
yarn install  # No node_modules — uses .pnp.cjs
```

## Key Files

- `docs/exist-api-openapi.yaml` — OpenAPI spec for the Exist API (the only substantive file so far)

## Editor Configuration

- 2-space indentation, utf-8 charset, LF line endings
- `.editorconfig` enforces these settings

## Development Notes

- No source code, tests, or build scripts exist yet
- This is a fresh repo — commit messages should follow conventional style (already configured via commit-msg hook)
