# Contributing

This project is early. Interfaces and layout will change.

## Before you invest a lot of time

Open an issue (or draft PR) to describe the problem and proposed shape of the change. Large refactors or API designs should be agreed in discussion first.

## Planning and agent artifacts

Design specs and implementation plans under `docs/superpowers/` are **intentionally excluded** from version control in this workspace (see `.git/info/exclude`). Do not commit them or force-add with `git add -f`.

## Go / OpenAPI client

After editing `docs/exist-api-openapi.yaml`, regenerate:

```bash
go generate ./pkg/existapi/
```

Requires Go 1.24+ (see `go.mod`). The generator is pinned in `pkg/existapi/generate.go` via `go run ...@v2.6.0`.

Run tests:

```bash
go test ./...
```

## Pull requests

- Keep changes focused and easy to review.
- Update docs when behavior or public surface changes.
- Match existing tone: accurate, not marketing-heavy.

## Issues

Bug reports, questions, and proposals are welcome. Include what you tried, what you expected, and what happened instead when reporting problems.
