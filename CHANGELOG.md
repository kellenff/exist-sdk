# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
once published versions exist.

## [Unreleased]

### Changed

- User-facing README pass: root + `pkg/exist` + `pkg/exist/oauth` onboarding, accurate “what works today” vs limitations, no API behavior change.

### Added

- **`pkg/exist/oauth`**: `TokenClient` (`ExchangeCode`, `Refresh`), `BuildAuthorizeURL`, `GeneratePKCE` (S256); PKCE on authorize URL returns an error until documented in Exist OAuth docs and the OpenAPI aggregate.
- Hand-written **`pkg/exist`** wrapper: `Client`, `WithSimpleToken` / `WithBearerToken`, `Profile`, escape hatch to generated `ClientWithResponses`; `httptest` coverage.
- Go module with `pkg/existapi` generated via **oapi-codegen v2.6.0** from `docs/exist-api-openapi.yaml` (`go generate ./pkg/existapi/`).
- Public repository baseline: README, `UNLICENSE`, contributing guide, changelog, and generic `.gitignore`.
