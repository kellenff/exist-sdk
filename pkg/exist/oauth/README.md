# oauth — Exist OAuth2 helpers

Pre-alpha. Small helpers for Exist OAuth2: build **`/oauth2/authorize`** URLs, **`POST /oauth2/access_token`** (**authorization_code** + **refresh_token**).

Placeholders like `<client_id>`, `<client_secret>`, and `<read-token>` in this README are examples only, not real credentials.

Not included: local callback HTTP server, browser automation, token storage.

## Flow

1. **`BuildAuthorizeURL`** with **`client_id`**, **`redirect_uri`**, **`scope`**. Open URL in browser; user signs in; Exist redirects to your **`redirect_uri`** with **`?code=`**.
2. **`NewTokenClient`** → **`ExchangeCode`** with the **`code`**, same **`redirect_uri`**, **`client_id`**, **`client_secret`**.
3. Use **`exist.NewClient(exist.WithBearerToken(tok.AccessToken))`** for API calls.
4. **`Refresh`** when **`refresh_token`** is available.

**PKCE:** **`GeneratePKCE()`** exists for RFC 7636 **`S256`** material; **`BuildAuthorizeURL`** currently returns an error if **`PKCE != nil`** until Exist docs and this repo's OpenAPI document authorize-query PKCE.

Security: do not log tokens or **`client_secret`**. Store **`client_secret`** only on trusted servers. Use HTTPS **`redirect_uri`** in production (Exist requirement).

- [Exist developer documentation](https://developer.exist.io/)
- [Important values](https://developer.exist.io/reference/important_values/)
