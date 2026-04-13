import type { ExistClient } from "../client.js";
import type { PagedAttributesWithValues } from "../types.js";

interface GetAttributesParams {
  page?: number;
  limit?: number;
  days?: number;
  groups?: string;
  date_max?: string;
  attributes?: string;
}

function buildQuery(params: GetAttributesParams): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return (
    "?" +
    entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")
  );
}

export async function getAttributesWithValues(
  client: ExistClient,
  params: GetAttributesParams = {},
): Promise<PagedAttributesWithValues> {
  const qs = buildQuery(params);
  return client.get(
    `/attributes/with-values/${qs}`,
  ) as Promise<PagedAttributesWithValues>;
}
