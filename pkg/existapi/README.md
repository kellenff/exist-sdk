# `existapi` (generated)

This package is **generated** from `docs/exist-api-openapi.yaml` at the repository root using [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) **v2.6.0**. Regenerate after spec changes:

```bash
go generate ./pkg/existapi/
```

## Status

Pre-alpha: types and client only (milestone A). No stability guarantee for generated shape between regenerations.

## Authentication

Exist uses:

- **Simple token:** `Authorization: Token <token>`
- **OAuth2 access token:** `Authorization: Bearer <token>`

The OpenAPI spec models simple auth as an `apiKey` in the `Authorization` header; you must supply the **full** header value (including the `Token ` prefix) where your transport expects it, or use the client’s request-editor hooks if you wire them.

## Server URL

The client defaults to the spec’s `servers` URL (`https://exist.io`). Override with `ClientWithResponses` options if the runtime package exposes a server override (see `api.gen.go`).
