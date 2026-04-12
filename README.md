# Exist SDK

**Pre-alpha — not usable yet.** This repository does not ship a working Exist API client today.

## What this is for

A future SDK for building apps and scripts on top of [Exist](https://exist.io/) using its HTTP API.

## Current state

- **Go:** root module `github.com/kellen/exist-sdk` (change `go.mod` if you publish under another path). Package [`pkg/existapi`](pkg/existapi/) holds **oapi-codegen** types and client generated from [`docs/exist-api-openapi.yaml`](docs/exist-api-openapi.yaml). Regenerate with `go generate ./pkg/existapi/`.
- No supported public API yet beyond the raw generated client; no stability guarantees for generated code between regenerations.

## Planned direction (non-binding)

- Typed or documented request helpers, auth handling, and error mapping aligned with Exist’s API.
- Clear versioning once code lands.

## API reference

- [Exist developer docs](https://developer.exist.io/reference/important_values/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
