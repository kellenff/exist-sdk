# `exist` — hand-written client wrapper

This package is a **thin** layer over the generated client in [`pkg/existapi`](../existapi/). The OpenAPI types and raw HTTP client live in **`existapi`**; **`exist.Client`** wires **defaults**, **authentication**, and a few convenience methods.

**Pre-alpha:** shape may change between releases.

## Limitations

**Pre-alpha** — see [root README](../../README.md) for stability and scope limits.

## OAuth (Bearer token)

For the authorization-code / refresh-token ceremony (authorize URL + token endpoint), use **[`pkg/exist/oauth`](../oauth/)** then pass **`tok.AccessToken`** to **`exist.WithBearerToken`**.

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

## Using the generated client directly

`Profile` is a thin wrapper around the generated client. Any other endpoint is available on **`existapi.ClientWithResponses`**:

```go
import (
	"context"

	"github.com/kellen/exist-sdk/pkg/exist"
	"github.com/kellen/exist-sdk/pkg/existapi"
)

func example(ctx context.Context, c *exist.Client) error {
	api := c.ClientWithResponses()
	resp, err := api.GetAccountsProfileWithResponse(ctx)
	if err != nil {
		return err
	}
	if resp.JSON200 != nil {
		_ = resp.JSON200.Username
	}
	return nil
}
```

For non-2xx responses, inspect **`resp.StatusCode()`** and the response body; map to **`exist.APIError`** in application code using the same ideas as **`Profile`**.

## Tests

```bash
go test ./pkg/exist/
```
