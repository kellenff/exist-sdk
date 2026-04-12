package oauth

import (
	"crypto/sha256"
	"encoding/base64"
	"testing"
)

func TestGeneratePKCE_S256Challenge(t *testing.T) {
	p, err := GeneratePKCE()
	if err != nil {
		t.Fatal(err)
	}
	if p.Method != "S256" {
		t.Fatalf("method = %q", p.Method)
	}
	if p.Verifier == "" || p.CodeChallenge == "" {
		t.Fatal("empty verifier or challenge")
	}
	sum := sha256.Sum256([]byte(p.Verifier))
	want := base64.RawURLEncoding.EncodeToString(sum[:])
	if p.CodeChallenge != want {
		t.Fatalf("challenge mismatch: got %q want %q", p.CodeChallenge, want)
	}
}
