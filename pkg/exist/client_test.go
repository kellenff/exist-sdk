package exist

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewClient_MissingAuth(t *testing.T) {
	_, err := NewClient()
	if err == nil {
		t.Fatal("expected error")
	}
}

func TestNewClient_BothAuths(t *testing.T) {
	_, err := NewClient(WithSimpleToken("a"), WithBearerToken("b"))
	if err == nil {
		t.Fatal("expected error")
	}
}

func TestProfile_OK(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/2/accounts/profile/", func(w http.ResponseWriter, r *http.Request) {
		if got := r.Header.Get("Authorization"); got != "Token secret" {
			t.Errorf("Authorization = %q", got)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"username":"u","first_name":"F","last_name":"L","timezone":"UTC"}`))
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	c, err := NewClient(WithSimpleToken("secret"), WithBaseURL(srv.URL))
	if err != nil {
		t.Fatal(err)
	}
	p, err := c.Profile(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if p.Username == nil || *p.Username != "u" {
		t.Fatalf("username = %v", p.Username)
	}
}

func TestProfile_Unauthorized_AsAPIError(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/2/accounts/profile/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte(`{"detail":"nope"}`))
	})
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	c, err := NewClient(WithBearerToken("bad"), WithBaseURL(srv.URL))
	if err != nil {
		t.Fatal(err)
	}
	_, err = c.Profile(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
	var ae *APIError
	if !errors.As(err, &ae) {
		t.Fatalf("want *APIError, got %T", err)
	}
	if ae.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d", ae.StatusCode)
	}
}
