import type {ExistClient} from '../client.js';
import type {PagedCorrelations, Correlation} from '../types.js';

interface GetCorrelationsParams {
  page?: number;
  limit?: number;
  confident?: 0 | 1;
  attribute?: string;
}

interface GetCorrelationComboParams {
  attribute: string;
  attribute2: string;
}

function buildQuery(params: object): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export async function getCorrelations(
  client: ExistClient,
  params: GetCorrelationsParams = {},
): Promise<PagedCorrelations> {
  const qs = buildQuery(params);
  return client.get(`/correlations/${qs}`) as Promise<PagedCorrelations>;
}

export async function getCorrelationCombo(
  client: ExistClient,
  params: GetCorrelationComboParams,
): Promise<Correlation> {
  const qs = buildQuery(params);
  return client.get(`/correlations/combo/${qs}`) as Promise<Correlation>;
}
