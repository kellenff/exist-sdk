package oauth

// Token is the JSON body from POST /oauth2/access_token (200).
type Token struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

// AuthorizeParams are query parameters for GET /oauth2/authorize.
// PKCE must be nil until Exist docs + OpenAPI document PKCE on authorize; non-nil returns an error from BuildAuthorizeURL.
type AuthorizeParams struct {
	ResponseType string // default "code" when empty
	ClientID     string
	RedirectURI  string
	Scope        string
	PKCE         *PKCE
}

// PKCE holds RFC 7636 S256 verifier and challenge (challenge goes on authorize URL when supported).
type PKCE struct {
	Verifier      string
	CodeChallenge string
	Method        string // "S256"
}

// ExchangeCodeParams is application/x-www-form-urlencoded for authorization_code grant.
type ExchangeCodeParams struct {
	Code         string
	RedirectURI  string
	ClientID     string
	ClientSecret string
}

// RefreshParams is application/x-www-form-urlencoded for refresh_token grant.
type RefreshParams struct {
	RefreshToken string
	ClientID     string
	ClientSecret string
}
