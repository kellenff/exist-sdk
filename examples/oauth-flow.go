// oauth-flow.go demonstrates a complete OAuth 2 authorization code flow.
//
// Usage:
//   EXIST_CLIENT_ID=your_client_id EXIST_CLIENT_SECRET=your_secret go run oauth-flow.go
//
// Required env vars:
//   EXIST_CLIENT_ID     - OAuth app client ID from Exist developer dashboard
//   EXIST_CLIENT_SECRET - OAuth app client secret from Exist developer dashboard
//
// This example does NOT run an embedded callback server. Instead it:
//   1. Builds the authorization URL and prints it
//   2. Asks the user to visit the URL and approve access
//   3. Waits for the user to press Enter after approving
//   4. Exchanges the auth code for tokens (user must provide the code)
package main

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/kellen/exist-sdk/pkg/exist/oauth"
)

func main() {
	clientID := os.Getenv("EXIST_CLIENT_ID")
	clientSecret := os.Getenv("EXIST_CLIENT_SECRET")
	if clientID == "" || clientSecret == "" {
		fmt.Fprintln(os.Stderr, "oauth-flow: EXIST_CLIENT_ID and EXIST_CLIENT_SECRET are required")
		os.Exit(1)
	}

	// Generate callback URL and state
	// Note: The state parameter (RFC 6749 Section 10.12) is not yet supported
	// by the SDK's BuildAuthorizeURL. For production OAuth, generate a cryptographically
	// random state value, include it in the authorization URL, and validate it
	// when receiving the callback.
	callbackURL := "http://localhost:8080/callback"
	authURL, err := oauth.BuildAuthorizeURL(oauth.AuthorizeParams{
		ClientID:    clientID,
		RedirectURI: callbackURL,
		Scope:       "mood_read mood_write",
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "oauth-flow: build auth URL: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Visit this URL to authorize:")
	fmt.Println(authURL)
	fmt.Println()
	fmt.Println("After authorizing, you will be redirected to")
	fmt.Printf("  %s\n", callbackURL)
	fmt.Println("The redirect will contain an authorization code in the 'code' query parameter.")
	fmt.Println()
	fmt.Print("Paste the authorization code here and press Enter: ")

	reader := bufio.NewReader(os.Stdin)
	code, _ := reader.ReadString('\n')
	code = strings.TrimSpace(code)
	if code == "" {
		fmt.Fprintln(os.Stderr, "oauth-flow: no code provided")
		os.Exit(1)
	}

	tokenClient, err := oauth.NewTokenClient()
	if err != nil {
		fmt.Fprintf(os.Stderr, "oauth-flow: create token client: %v\n", err)
		os.Exit(1)
	}

	tokens, err := tokenClient.ExchangeCode(context.Background(), oauth.ExchangeCodeParams{
		Code:         code,
		RedirectURI:  callbackURL,
		ClientID:     clientID,
		ClientSecret: clientSecret,
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "oauth-flow: exchange code: %v\n", err)
		os.Exit(1)
	}

	fmt.Println()
	fmt.Println("Access token:", tokens.AccessToken)
	fmt.Println("Token type:", tokens.TokenType)
	fmt.Printf("Expires in: %d seconds\n", tokens.ExpiresIn)
	fmt.Println("Refresh token:", tokens.RefreshToken)
	fmt.Println("Scope:", tokens.Scope)
}