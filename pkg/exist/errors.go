package exist

import (
	"fmt"
	"strings"
)

const bodyPreviewMaxRunes = 512

// APIError describes a non-success Exist API response in a stable shape for errors.As.
type APIError struct {
	StatusCode  int
	Message     string
	BodyPreview string // optional; truncated; may be empty
}

func (e *APIError) Error() string {
	if e.BodyPreview == "" {
		return fmt.Sprintf("exist api: status=%d: %s", e.StatusCode, e.Message)
	}
	return fmt.Sprintf("exist api: status=%d: %s: body=%q", e.StatusCode, e.Message, e.BodyPreview)
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
