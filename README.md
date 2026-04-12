# Exist SDK

**Pre-alpha — not usable yet.** This repository does not ship a working Exist API client today.

## What this is for

A future SDK for building apps and scripts on top of [Exist](https://exist.io/) using its HTTP API.

## Current state

- **Go:** root module `github.com/kellen/exist-sdk` (change `go.mod` if you publish under another path). Prefer [`pkg/exist`](pkg/exist/) for app code (thin wrapper: auth, defaults, `Profile`). OAuth2 authorize URL and token exchange helpers live in [`pkg/exist/oauth`](pkg/exist/oauth/) (pre-alpha; no callback server — see package README). Low-level generated types and client are in [`pkg/existapi`](pkg/existapi/) from [`docs/exist-api-openapi.yaml`](docs/exist-api-openapi.yaml) — regenerate with `go generate ./pkg/existapi/`.
- Pre-alpha: no stability guarantees for generated or wrapper APIs between releases.

## Planned direction (non-binding)

- Typed or documented request helpers, auth handling, and error mapping aligned with Exist’s API.
- Clear versioning once code lands.

## API reference

- [Exist developer docs](https://developer.exist.io/reference/important_values/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
