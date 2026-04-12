package oauth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

const pkceVerifierByteLen = 32

// GeneratePKCE returns a new RFC 7636 S256 PKCE pair (verifier length 43+ chars).
func GeneratePKCE() (*PKCE, error) {
	v := make([]byte, pkceVerifierByteLen)
	if _, err := rand.Read(v); err != nil {
		return nil, fmt.Errorf("oauth: generate pkce verifier: %w", err)
	}
	verifier := base64.RawURLEncoding.EncodeToString(v)
	sum := sha256.Sum256([]byte(verifier))
	challenge := base64.RawURLEncoding.EncodeToString(sum[:])
	return &PKCE{
		Verifier:      verifier,
		CodeChallenge: challenge,
		Method:        "S256",
	}, nil
}
