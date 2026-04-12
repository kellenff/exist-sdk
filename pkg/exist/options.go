package exist

import "net/http"

type authKind int

const (
	authNone authKind = iota
	authSimpleToken
	authBearer
)

type config struct {
	auth       authKind
	simpleSet  bool
	bearerSet  bool
	token      string
	baseURL    string
	httpClient *http.Client
}

// Option configures NewClient.
type Option func(*config) error

// WithSimpleToken sets Authorization: Token <token> on every request (Exist read token).
func WithSimpleToken(token string) Option {
	return func(c *config) error {
		c.simpleSet = true
		c.auth = authSimpleToken
		c.token = token
		return nil
	}
}

// WithBearerToken sets Authorization: Bearer <token> on every request (OAuth2 access token).
func WithBearerToken(token string) Option {
	return func(c *config) error {
		c.bearerSet = true
		c.auth = authBearer
		c.token = token
		return nil
	}
}

// WithBaseURL overrides the API origin (default https://exist.io). Use httptest.Server URL in tests.
func WithBaseURL(raw string) Option {
	return func(c *config) error {
		c.baseURL = raw
		return nil
	}
}

// WithHTTPClient overrides the HTTP client (default 60s timeout client).
func WithHTTPClient(h *http.Client) Option {
	return func(c *config) error {
		c.httpClient = h
		return nil
	}
}
