import { describe, it, expect, vi } from "vitest";
import { exchangeSimpleToken } from "../../src/endpoints/auth.js";
import { createClient } from "../../src/client.js";

describe("exchangeSimpleToken", () => {
  it("calls POST /auth/simple-token/ with credentials", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: "abc123" }),
    });

    const client = createClient({ token: "unused", fetch: mockFetch });
    const result = await exchangeSimpleToken(client, {
      username: "user@example.com",
      password: "secret",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/auth/simple-token/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "user@example.com",
          password: "secret",
        }),
      }),
    );
    expect(result).toEqual({ token: "abc123" });
  });
});
