# Exist SDK

**Pre-alpha.** Go module for the [Exist](https://exist.io/) HTTP API. The supported **hand-written** surface is intentionally small; types and HTTP operations also live in generated [`pkg/existapi`](pkg/existapi/).

## What you can use today

- **[`pkg/exist`](pkg/exist/)** — `NewClient` with `WithSimpleToken` or `WithBearerToken` (defaults: base URL `https://exist.io`, HTTP client timeout **60s** unless overridden), **`Profile`** for the authenticated account profile, and **`ClientWithResponses()`** to call any generated **`existapi`** operation.
- **[`pkg/exist/oauth`](pkg/exist/oauth/)** (optional) — `BuildAuthorizeURL`, **`TokenClient`** with **`ExchangeCode`** / **`Refresh`**, **`GeneratePKCE`**. No embedded OAuth callback server.

## Limitations

- **Stability:** Wrappers and generated code may change between commits; there is **no** published semver/registry story in this README until the project announces one elsewhere.
- **Scope:** No automatic retries or **429** handling in **`exist.Client`** today.
- **OAuth:** **`BuildAuthorizeURL`** returns an error if **`PKCE != nil`** until Exist’s docs and this repo’s OpenAPI describe PKCE on the authorize URL ([`pkg/exist/oauth/README.md`](pkg/exist/oauth/README.md)).

## Install

Requires **Go 1.24+** (see root **`go.mod`**). From your module:

```bash
go get github.com/kellen/exist-sdk
```

**Next step:** [`pkg/exist/README.md`](pkg/exist/README.md) for a minimal **`Profile`** example and the OpenAPI regen command.

## Links

- [Exist developer documentation](https://developer.exist.io/)
- [Important values](https://developer.exist.io/reference/important_values/)
- [Contributing](CONTRIBUTING.md)
