package oauth

import (
	"fmt"
	"net/url"
	"strings"
)

const defaultAuthorizeHost = "https://exist.io"

// BuildAuthorizeURL returns a full URL string for GET /oauth2/authorize (default host https://exist.io).
// PKCE on the authorize URL is not supported until documented; pass PKCE=nil.
func BuildAuthorizeURL(p AuthorizeParams) (string, error) {
	if p.PKCE != nil {
		return "", fmt.Errorf("oauth: PKCE on authorize URL not supported yet (pass PKCE=nil); see Exist OAuth docs and OpenAPI aggregate")
	}
	if strings.TrimSpace(p.ClientID) == "" {
		return "", fmt.Errorf("oauth: ClientID is required")
	}
	if strings.TrimSpace(p.RedirectURI) == "" {
		return "", fmt.Errorf("oauth: RedirectURI is required")
	}
	if strings.TrimSpace(p.Scope) == "" {
		return "", fmt.Errorf("oauth: Scope is required")
	}
	if _, err := url.Parse(p.RedirectURI); err != nil {
		return "", fmt.Errorf("oauth: RedirectURI: %w", err)
	}
	rt := p.ResponseType
	if rt == "" {
		rt = "code"
	}
	if rt != "code" {
		return "", fmt.Errorf("oauth: ResponseType %q not supported (only \"code\")", rt)
	}
	q := url.Values{}
	q.Set("response_type", rt)
	q.Set("client_id", p.ClientID)
	q.Set("redirect_uri", p.RedirectURI)
	q.Set("scope", p.Scope)
	u, err := url.Parse(defaultAuthorizeHost)
	if err != nil {
		return "", err
	}
	u.Path = "/oauth2/authorize"
	u.RawQuery = q.Encode()
	return u.String(), nil
}
