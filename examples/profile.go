// profile.go demonstrates fetching the authenticated user's profile.
//
// Usage:
//   EXIST_TOKEN=your_token go run profile.go
//
// Required env vars:
//   EXIST_TOKEN - simple token from Exist developer dashboard
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/kellen/exist-sdk/pkg/exist"
)

func main() {
	token := os.Getenv("EXIST_TOKEN")
	if token == "" {
		fmt.Fprintln(os.Stderr, "profile: EXIST_TOKEN is required")
		os.Exit(1)
	}

	client, err := exist.NewClient(exist.WithSimpleToken(token))
	if err != nil {
		fmt.Fprintf(os.Stderr, "profile: create client: %v\n", err)
		os.Exit(1)
	}

	profile, err := client.Profile(context.Background())
	if err != nil {
		fmt.Fprintf(os.Stderr, "profile: get profile: %v\n", err)
		os.Exit(1)
	}

	if profile.Username != nil {
		fmt.Printf("Username: %s\n", *profile.Username)
	}
	if profile.FirstName != nil {
		fmt.Printf("First Name: %s\n", *profile.FirstName)
	}
	if profile.LastName != nil {
		fmt.Printf("Last Name: %s\n", *profile.LastName)
	}
	if profile.Timezone != nil {
		fmt.Printf("Timezone: %s\n", *profile.Timezone)
	}
}
