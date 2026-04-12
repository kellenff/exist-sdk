package oauth

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestExchangeCode_OK(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/oauth2/access_token", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("method = %s", r.Method)
		}
		if ct := r.Header.Get("Content-Type"); !strings.HasPrefix(ct, "application/x-www-form-urlencoded") {
			t.Fatalf("Content-Type = %q", ct)
		}
		b, _ := io.ReadAll(r.Body)
		if !strings.Contains(string(b), "grant_type=authorization_code") {
			t.Fatalf("body = %q", string(b))
		}
		if !strings.Contains(string(b), "code=abc") {
			t.Fatalf("body = %q", string(b))
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"access_token":"at","token_type":"Bearer","expires_in":3600,"refresh_token":"rt","scope":"mood_read"}`))
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	tc, err := NewTokenClient(WithTokenBaseURL(srv.URL))
	if err != nil {
		t.Fatal(err)
	}
	tok, err := tc.ExchangeCode(context.Background(), ExchangeCodeParams{
		Code:         "abc",
		RedirectURI:  "https://app.example/cb",
		ClientID:     "id",
		ClientSecret: "secret",
	})
	if err != nil {
		t.Fatal(err)
	}
	if tok.AccessToken != "at" || tok.RefreshToken != "rt" {
		t.Fatalf("token = %+v", tok)
	}
}

func TestExchangeCode_HTTPError_As(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/oauth2/access_token", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte(`{"error":"invalid_grant"}`))
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	tc, err := NewTokenClient(WithTokenBaseURL(srv.URL))
	if err != nil {
		t.Fatal(err)
	}
	_, err = tc.ExchangeCode(context.Background(), ExchangeCodeParams{
		Code:         "x",
		RedirectURI:  "https://app.example/cb",
		ClientID:     "id",
		ClientSecret: "secret",
	})
	if err == nil {
		t.Fatal("expected error")
	}
	var he *HTTPError
	if !errors.As(err, &he) {
		t.Fatalf("want *HTTPError, got %T", err)
	}
	if he.StatusCode != http.StatusBadRequest {
		t.Fatalf("status = %d", he.StatusCode)
	}
}

func TestRefresh_OK(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/oauth2/access_token", func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		if !strings.Contains(string(b), "grant_type=refresh_token") {
			t.Fatalf("body = %q", string(b))
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"access_token":"new","token_type":"Bearer","expires_in":3600}`))
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	tc, err := NewTokenClient(WithTokenBaseURL(srv.URL))
	if err != nil {
		t.Fatal(err)
	}
	tok, err := tc.Refresh(context.Background(), RefreshParams{
		RefreshToken: "oldrt",
		ClientID:     "id",
		ClientSecret: "secret",
	})
	if err != nil {
		t.Fatal(err)
	}
	if tok.AccessToken != "new" {
		t.Fatalf("access = %q", tok.AccessToken)
	}
}
