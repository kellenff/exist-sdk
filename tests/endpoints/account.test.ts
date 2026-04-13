import { describe, it, expect, vi } from "vitest";
import { getProfile } from "../../src/endpoints/account";
import { createClient } from "../../src/client";

describe("getProfile", () => {
  it("calls GET /accounts/profile/", async () => {
    const mockProfile = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      timezone: "UTC",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockProfile),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    const result = await getProfile(client);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/accounts/profile/",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Token abc" }),
      }),
    );
    expect(result).toEqual(mockProfile);
  });
});
