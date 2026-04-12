# `exist` — hand-written client wrapper

This package is a **thin** layer over the generated client in [`pkg/existapi`](../existapi/). The OpenAPI types and raw HTTP client live in **`existapi`**; **`exist.Client`** wires **defaults**, **authentication**, and a few convenience methods.

**Pre-alpha:** shape may change between releases.

## Regenerating the OpenAPI client

When `docs/exist-api-openapi.yaml` changes:

```bash
go generate ./pkg/existapi/
```

## Usage

```go
c, err := exist.NewClient(
    exist.WithSimpleToken("<read-token>"),
)
if err != nil { /* ... */ }
prof, err := c.Profile(ctx)
```

Use **`WithBearerToken`** for OAuth2 access tokens. Exist expects:

- Simple token: `Authorization: Token <token>`
- OAuth2: `Authorization: Bearer <token>`

See [Important values](https://developer.exist.io/reference/important_values/).

For any endpoint without a wrapper here, use **`c.ClientWithResponses()`** and the generated methods on **`existapi.ClientWithResponses`**.

## Tests

```bash
go test ./pkg/exist/
```
