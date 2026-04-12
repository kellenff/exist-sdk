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

## Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs on pushes and pull requests to **`main`**:

```bash
go test ./...
go vet ./...
```

Run the same commands locally before opening a PR so CI matches your machine.

## Pull requests

- Keep changes focused and easy to review.
- Update docs when behavior or public surface changes.
- Match existing tone: accurate, not marketing-heavy.
- Ensure CI passes (same commands as in [Continuous integration](#continuous-integration)).

## Issues

Bug reports, questions, and proposals are welcome. Include what you tried, what you expected, and what happened instead when reporting problems.

## Releases (maintainers)

Tags are **optional** until you publish a release. The first annotated tag on this track is intended to be **`v0.1.0`** (semver **v0** — breaking changes may still occur; see `README.md`).

```bash
git checkout main
git pull
# After updating CHANGELOG.md for the release:
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

Consumers: `go get github.com/kellen/exist-sdk@v0.1.0` (after the tag exists on the default remote).
