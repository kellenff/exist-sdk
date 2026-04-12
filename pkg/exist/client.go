package exist

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/kellen/exist-sdk/pkg/existapi"
)

const defaultServer = "https://exist.io"

// Client is a thin wrapper over the generated Exist API client.
type Client struct {
	api *existapi.ClientWithResponses
}

// NewClient returns a Client. You must pass exactly one of WithSimpleToken or WithBearerToken.
func NewClient(opts ...Option) (*Client, error) {
	cfg := &config{
		baseURL: defaultServer,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
	for _, o := range opts {
		if err := o(cfg); err != nil {
			return nil, err
		}
	}
	if cfg.simpleSet && cfg.bearerSet {
		return nil, fmt.Errorf("exist: pass only one of WithSimpleToken or WithBearerToken")
	}
	switch cfg.auth {
	case authNone:
		return nil, fmt.Errorf("exist: NewClient requires WithSimpleToken or WithBearerToken")
	case authSimpleToken:
		if cfg.token == "" {
			return nil, fmt.Errorf("exist: WithSimpleToken requires non-empty token")
		}
	case authBearer:
		if cfg.token == "" {
			return nil, fmt.Errorf("exist: WithBearerToken requires non-empty token")
		}
	default:
		return nil, fmt.Errorf("exist: invalid auth configuration")
	}

	var editors []existapi.ClientOption
	editors = append(editors, existapi.WithHTTPClient(cfg.httpClient))

	var prefix string
	switch cfg.auth {
	case authSimpleToken:
		prefix = "Token "
	case authBearer:
		prefix = "Bearer "
	}
	token := cfg.token
	editors = append(editors, existapi.WithRequestEditorFn(func(ctx context.Context, req *http.Request) error {
		req.Header.Set("Authorization", prefix+token)
		return nil
	}))

	api, err := existapi.NewClientWithResponses(cfg.baseURL, editors...)
	if err != nil {
		return nil, err
	}
	return &Client{api: api}, nil
}

// ClientWithResponses exposes the generated client for endpoints without a wrapper method.
func (c *Client) ClientWithResponses() *existapi.ClientWithResponses {
	return c.api
}

// Profile returns the authenticated user's profile (GET /api/2/accounts/profile/).
func (c *Client) Profile(ctx context.Context) (*existapi.UserProfile, error) {
	resp, err := c.api.GetAccountsProfileWithResponse(ctx)
	if err != nil {
		return nil, err
	}
	if resp.JSON200 != nil {
		return resp.JSON200, nil
	}
	return nil, profileAPIError(resp)
}

func profileAPIError(resp *existapi.GetAccountsProfileResponse) *APIError {
	st := resp.StatusCode()
	msg := "unexpected response"
	if st == http.StatusUnauthorized {
		msg = "unauthorized"
	}
	return &APIError{
		StatusCode:  st,
		Message:     msg,
		BodyPreview: truncateBodyPreview(resp.Body),
	}
}
