package oauth

import (
	"net/url"
	"strings"
	"testing"
)

func TestBuildAuthorizeURL_MissingClientID(t *testing.T) {
	_, err := BuildAuthorizeURL(AuthorizeParams{
		RedirectURI: "https://app.example/cb",
		Scope:       "mood_read",
	})
	if err == nil {
		t.Fatal("expected error")
	}
}

func TestBuildAuthorizeURL_PKCENotYetSupported(t *testing.T) {
	p, _ := GeneratePKCE()
	_, err := BuildAuthorizeURL(AuthorizeParams{
		ClientID:    "cid",
		RedirectURI: "https://app.example/cb",
		Scope:       "mood_read",
		PKCE:        p,
	})
	if err == nil {
		t.Fatal("expected error")
	}
	if !strings.Contains(err.Error(), "PKCE") {
		t.Fatalf("error should mention PKCE: %v", err)
	}
}

func TestBuildAuthorizeURL_OK(t *testing.T) {
	raw, err := BuildAuthorizeURL(AuthorizeParams{
		ClientID:    "myclient",
		RedirectURI: "https://app.example/oauth/callback",
		Scope:       "mood_read mood_write",
	})
	if err != nil {
		t.Fatal(err)
	}
	u, err := url.Parse(raw)
	if err != nil {
		t.Fatal(err)
	}
	if u.Scheme != "https" || u.Host != "exist.io" {
		t.Fatalf("host/scheme = %q %q", u.Scheme, u.Host)
	}
	if u.Path != "/oauth2/authorize" {
		t.Fatalf("path = %q", u.Path)
	}
	q := u.Query()
	if q.Get("response_type") != "code" {
		t.Fatalf("response_type = %q", q.Get("response_type"))
	}
	if q.Get("client_id") != "myclient" {
		t.Fatalf("client_id = %q", q.Get("client_id"))
	}
	if q.Get("redirect_uri") != "https://app.example/oauth/callback" {
		t.Fatalf("redirect_uri = %q", q.Get("redirect_uri"))
	}
	if q.Get("scope") != "mood_read mood_write" {
		t.Fatalf("scope = %q", q.Get("scope"))
	}
}
