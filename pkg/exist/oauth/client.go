package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const defaultTokenOrigin = "https://exist.io"

type tokenClientConfig struct {
	origin string
	hc     *http.Client
}

// TokenClientOption configures NewTokenClient.
type TokenClientOption func(*tokenClientConfig) error

// WithTokenBaseURL sets the API origin (default https://exist.io). Use httptest.Server URL in tests (no trailing slash required).
func WithTokenBaseURL(raw string) TokenClientOption {
	return func(c *tokenClientConfig) error {
		raw = strings.TrimSpace(raw)
		if raw == "" {
			return fmt.Errorf("oauth: WithTokenBaseURL requires non-empty URL")
		}
		c.origin = strings.TrimRight(raw, "/")
		return nil
	}
}

// WithHTTPClient sets the HTTP client (default 60s timeout).
func WithHTTPClient(h *http.Client) TokenClientOption {
	return func(c *tokenClientConfig) error {
		if h == nil {
			return fmt.Errorf("oauth: WithHTTPClient requires non-nil client")
		}
		c.hc = h
		return nil
	}
}

// TokenClient calls Exist OAuth2 token endpoint.
type TokenClient struct {
	origin string
	hc     *http.Client
}

// NewTokenClient returns a client for POST /oauth2/access_token.
func NewTokenClient(opts ...TokenClientOption) (*TokenClient, error) {
	cfg := tokenClientConfig{
		origin: strings.TrimRight(defaultTokenOrigin, "/"),
		hc: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
	for _, o := range opts {
		if err := o(&cfg); err != nil {
			return nil, err
		}
	}
	return &TokenClient{origin: cfg.origin, hc: cfg.hc}, nil
}

func (c *TokenClient) tokenEndpointURL() (string, error) {
	base, err := url.Parse(c.origin)
	if err != nil {
		return "", fmt.Errorf("oauth: parse origin: %w", err)
	}
	return base.JoinPath("oauth2", "access_token").String(), nil
}

// ExchangeCode exchanges an authorization code per OAuthAuthorizationCodeRequest.
func (c *TokenClient) ExchangeCode(ctx context.Context, p ExchangeCodeParams) (*Token, error) {
	if strings.TrimSpace(p.Code) == "" {
		return nil, fmt.Errorf("oauth: Code is required")
	}
	if strings.TrimSpace(p.RedirectURI) == "" {
		return nil, fmt.Errorf("oauth: RedirectURI is required")
	}
	if strings.TrimSpace(p.ClientID) == "" {
		return nil, fmt.Errorf("oauth: ClientID is required")
	}
	if strings.TrimSpace(p.ClientSecret) == "" {
		return nil, fmt.Errorf("oauth: ClientSecret is required")
	}
	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("code", p.Code)
	form.Set("client_id", p.ClientID)
	form.Set("client_secret", p.ClientSecret)
	form.Set("redirect_uri", p.RedirectURI)
	return c.postToken(ctx, form)
}

// Refresh obtains a new access token using a refresh token per OAuthRefreshTokenRequest.
func (c *TokenClient) Refresh(ctx context.Context, p RefreshParams) (*Token, error) {
	if strings.TrimSpace(p.RefreshToken) == "" {
		return nil, fmt.Errorf("oauth: RefreshToken is required")
	}
	if strings.TrimSpace(p.ClientID) == "" {
		return nil, fmt.Errorf("oauth: ClientID is required")
	}
	if strings.TrimSpace(p.ClientSecret) == "" {
		return nil, fmt.Errorf("oauth: ClientSecret is required")
	}
	form := url.Values{}
	form.Set("grant_type", "refresh_token")
	form.Set("refresh_token", p.RefreshToken)
	form.Set("client_id", p.ClientID)
	form.Set("client_secret", p.ClientSecret)
	return c.postToken(ctx, form)
}

func (c *TokenClient) postToken(ctx context.Context, form url.Values) (*Token, error) {
	endpoint, err := c.tokenEndpointURL()
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.hc.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, &HTTPError{
			StatusCode:  resp.StatusCode,
			Message:     http.StatusText(resp.StatusCode),
			BodyPreview: truncateBodyPreview(body),
		}
	}
	var tok Token
	if err := json.Unmarshal(body, &tok); err != nil {
		return nil, &HTTPError{
			StatusCode:  0,
			Message:     "invalid token response json",
			BodyPreview: truncateBodyPreview(body),
		}
	}
	return &tok, nil
}
