package oauth

import (
	"fmt"
	"strings"
)

const bodyPreviewMaxRunes = 512

// HTTPError describes a non-2xx or malformed token-endpoint response for errors.As.
// StatusCode is 0 when the failure is not the HTTP status line (e.g. JSON parse error on a 200 body).
type HTTPError struct {
	StatusCode  int
	Message     string
	BodyPreview string
}

func (e *HTTPError) Error() string {
	if e.BodyPreview == "" {
		return fmt.Sprintf("exist oauth: status=%d: %s", e.StatusCode, e.Message)
	}
	return fmt.Sprintf("exist oauth: status=%d: %s: body=%q", e.StatusCode, e.Message, e.BodyPreview)
}

func truncateBodyPreview(b []byte) string {
	s := strings.TrimSpace(string(b))
	if s == "" {
		return ""
	}
	r := []rune(s)
	if len(r) > bodyPreviewMaxRunes {
		return string(r[:bodyPreviewMaxRunes]) + "…"
	}
	return s
}
