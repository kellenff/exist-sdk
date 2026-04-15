import type {ExistClient} from '../client.js';
import type {PagedAverages} from '../types.js';

interface GetAveragesParams {
  page?: number;
  limit?: number;
  attributes?: string;
  include_historical?: 0 | 1;
}

function buildQuery(params: GetAveragesParams): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export async function getAverages(
  client: ExistClient,
  params: GetAveragesParams = {},
): Promise<PagedAverages> {
  const qs = buildQuery(params);
  return client.get(`/averages/${qs}`) as Promise<PagedAverages>;
}
