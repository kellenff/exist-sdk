import { describe, it, expect, vi } from "vitest";
import { getAttributesWithValues } from "../../src/endpoints/attributes.js";
import { createClient } from "../../src/client.js";

describe("getAttributesWithValues", () => {
  it("calls GET /attributes/with-values/ with default pagination", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ count: 0, results: [] }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    await getAttributesWithValues(client);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/attributes/with-values/",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("passes query params for page, limit, days, attributes filters", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ count: 0, results: [] }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    await getAttributesWithValues(client, {
      page: 2,
      limit: 50,
      days: 7,
      attributes: "mood",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/attributes/with-values/?page=2&limit=50&days=7&attributes=mood",
      expect.any(Object),
    );
  });
});
