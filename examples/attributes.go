// attributes.go demonstrates fetching attribute data with values.
//
// Usage:
//   EXIST_TOKEN=your_token go run attributes.go
//
// Required env vars:
//   EXIST_TOKEN - simple token from Exist developer dashboard
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/kellen/exist-sdk/pkg/exist"
	"github.com/kellen/exist-sdk/pkg/existapi"
)

func main() {
	token := os.Getenv("EXIST_TOKEN")
	if token == "" {
		fmt.Fprintln(os.Stderr, "attributes: EXIST_TOKEN is required")
		os.Exit(1)
	}

	client, err := exist.NewClient(exist.WithSimpleToken(token))
	if err != nil {
		fmt.Fprintf(os.Stderr, "attributes: create client: %v\n", err)
		os.Exit(1)
	}

	params := &existapi.GetAttributesWithValuesParams{}
	resp, err := client.ClientWithResponses().GetAttributesWithValuesWithResponse(context.Background(), params)
	if err != nil {
		fmt.Fprintf(os.Stderr, "attributes: get attributes: %v\n", err)
		os.Exit(1)
	}
	if resp.JSON200 == nil {
		fmt.Fprintf(os.Stderr, "attributes: unexpected status %d\n", resp.StatusCode())
		os.Exit(1)
	}

	attrs := resp.JSON200.Results
	if attrs == nil || len(*attrs) == 0 {
		fmt.Println("No attributes found")
		return
	}

	fmt.Printf("Attributes (total %d):\n", safeInt(resp.JSON200.Count))
	for _, attr := range *attrs {
		if attr.Name != nil {
			name := *attr.Name
			fmt.Printf("  - %s", name)
			if attr.Label != nil && *attr.Label != name {
				fmt.Printf(" (label: %s)", *attr.Label)
			}
			if attr.ValueTypeDescription != nil {
				fmt.Printf(" [%s]", *attr.ValueTypeDescription)
			}
			fmt.Println()
		}
	}
}

func safeInt(v *int) int {
	if v == nil {
		return 0
	}
	return *v
}