# AGENTS.md

Guidance for autonomous coding agents (and humans using agent-assisted workflows) working in this repository.

## Mission

Build a **client SDK for the [Exist](https://exist.io/) HTTP API** that is honest about maturity, easy to adopt, and safe to evolve. The repository is **pre-alpha**: public-facing docs may exist before a supported library surface does.

## Non-negotiables

- **Truth in packaging:** Do not imply the SDK is production-ready, fully featured, or published to a registry unless `README.md` and release artifacts say so.
- **No invented API behavior:** When the Exist API is unclear, **read the official docs** and/or add explicit `TODO` / issue references instead of guessing endpoints, fields, or auth steps.
- **License:** All contributions are under the [Unlicense](UNLICENSE) (`UNLICENSE` at repo root). Do not add files under other licenses without explicit maintainer direction.
- **Secrets:** Never commit tokens, refresh tokens, client secrets, `.env` files with real values, or user-specific config. Use examples with placeholders only.
- **Local planning docs:** `docs/superpowers/` (specs, plans) stays **out of git** per `.git/info/exclude`. Do not commit those files and do not use `git add -f` to bypass exclude.

## Authoritative references

| Topic                         | URL                                                    |
| ----------------------------- | ------------------------------------------------------ |
| Exist developer documentation | https://developer.exist.io/                            |
| Important values / concepts   | https://developer.exist.io/reference/important_values/ |

Prefer **official Exist documentation** over third-party blog posts when behavior or naming differs.

## Repository snapshot

**Current layout:**

- `README.md` — user-facing status and intent.
- `CONTRIBUTING.md` — collaboration expectations; includes **Go** regen and test commands.
- `CHANGELOG.md` — Keep a Changelog–style history.
- `UNLICENSE` — public domain dedication.
- `.gitignore` — generic OS/editor/temp noise only.
- **`go.mod` / `go.sum`** — Go module **`github.com/kellen/exist-sdk`** (change module path in `go.mod` if the canonical import URL differs).
- **`docs/exist-api-openapi.yaml`** — OpenAPI 3 aggregate for Exist API v2 (+ OAuth paths); source for codegen.
- **`api/oapi-codegen.yaml`** — oapi-codegen v2 config for the generated client.
- **`pkg/existapi/`** — **Generated only** (`api.gen.go` from `go generate ./pkg/existapi/`). Do not hand-edit; regen after spec changes.
- **`pkg/exist/`** — **Hand-written** thin client: `Client`, auth options (`Token` / `Bearer`), `Profile`, `APIError`; tests under `*_test.go`.
- **`.github/workflows/ci.yml`** — GitHub Actions: `go test ./...`, `go vet ./...` on PRs and pushes to `main`.
- **`examples/`** — standalone Go module (`github.com/kellen/exist-sdk/examples`) with runnable programs: `profile.go`, `attributes.go`, `oauth-flow.go`. Each imports `github.com/kellen/exist-sdk` (the root module) with a `go replace` for local development.

**Local-only (excluded from git):**

- `docs/superpowers/` — design specs and plans; never commit (see **Non-negotiables**).

**Not present yet (expected future work):**

- Release automation beyond manual tags and docs (e.g. goreleaser, generated release notes).
- Other language SDKs or `package.json` / etc. — **Go is the only supported toolchain today**; do not add a second language without maintainer agreement.

When layout or commands change, **update this file** in the same change so agents stay accurate.

## How to work here

### Default workflow

1. Read `README.md` and this `AGENTS.md` for scope and tone.
2. If the change is user-visible or architectural, skim `CONTRIBUTING.md`.
3. Make the **smallest** change that satisfies the task; avoid drive-by refactors.
4. If you add a command or directory, document it here or in `README.md` when it becomes the supported path.

### Change size and focus

- One PR / one agent session should prefer **one coherent outcome** (feature, fix, or doc set), not mixed refactors.
- Do not rename or reorganize the repo broadly without an agreed plan (see `CONTRIBUTING.md`).

### Documentation and comments

- **User docs:** Clear, direct, non-marketing. State limitations explicitly.
- **Code comments:** Explain **why** (intent, invariants, API quirks), not what the syntax already says.
- **Links:** Use stable Exist docs URLs where possible.

### API client design principles (when code exists)

Design for **predictable HTTP behavior** and **transparent errors**:

- Separate **transport** (HTTP, headers, timeouts) from **resource helpers** unless a thin unified client is the explicit design.
- Prefer **explicit** authentication per Exist docs over implicit globals.
- Version **breaking** changes via semver (once published) and `CHANGELOG.md` entries.

Do **not** bake in undocumented endpoints or reverse-engineered mobile app internals unless labeled explicitly as unsupported/experimental.

## Security and privacy

- Treat any token or OAuth material as **high sensitivity**.
- Redact user data in logs, examples, and test fixtures.
- Avoid logging full request/response bodies in default paths; gate verbose logging behind debug flags.
- If adding example scripts, use environment variables (e.g., `EXIST_TOKEN`) with **empty** defaults and clear `.env.example` patterns—never real values.

## Testing and verification

**Integration / live API:** not required for default tests; if you add opt-in integration tests needing credentials, document the env vars and skip behavior in `CONTRIBUTING.md` and PR text.

If a change is not covered by tests, state in the PR what was **not** run and why.

## Style and quality bar

- **Match the codebase** that exists: imports, naming, formatting, and file layout.
- **No silent failures:** Prefer explicit errors over swallowed exceptions.
- **Compatibility:** Do not drop supported language/runtime versions without a documented bump and changelog entry.

## Git and commit messages

- Use imperative mood: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` prefixes are welcome when they clarify intent.
- Avoid giant commits that mix generated files, lockfile churn, and logic.

## Pull request checklist (agents)

Before marking work complete, verify:

- [ ] Scope matches the request; no unrelated files.
- [ ] Docs (`README.md`, `CHANGELOG.md` when user-visible) updated if behavior or usage changed.
- [ ] No secrets or machine-specific paths committed.
- [ ] Claims in docs match what the code actually does.
- [ ] CI is green on the PR (or explain if Actions cannot run on the fork).

## Anti-patterns

- **Marketing README** while the library is stubbed or broken.
- **Speculative features** not backed by Exist API docs or maintainer agreement.
- **Heavy frameworks** for a thin HTTP SDK without justification.
- **Monolithic files** that mix transport, auth, pagination, and every resource type with no boundaries.

## When stuck

- Open a **draft** PR or issue with a concrete question and links to the relevant Exist doc sections.
- Prefer documenting unknowns over shipping guesses.

## Maintainer note

This file should evolve with the project. When adding CI, release automation, or materially new packages, update the **Repository snapshot** and **Testing and verification** sections in the same change so agents remain grounded in reality.
