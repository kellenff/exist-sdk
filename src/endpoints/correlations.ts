import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';
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

function validate<T>(schema: z.ZodSchema<T>, data: unknown, errorMessage: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const err: ExistError = {
      status: 0,
      message: errorMessage,
      cause: result.error.issues,
    };
    throw err;
  }
  return result.data;
}

const PagedCorrelationsSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown()),
});

const CorrelationSchema = z.object({
  date: z.string(),
  period: z.number(),
  offset: z.number(),
  attribute: z.string(),
  attribute2: z.string(),
  value: z.number(),
  p: z.number().nullable(),
  percentage: z.number().nullable(),
  stars: z.number().nullable(),
});

export async function getCorrelations(
  client: ExistClient,
  params: GetCorrelationsParams = {},
): Promise<PagedCorrelations> {
  const qs = buildQuery(params);
  const data = await client.get(`/correlations/${qs}`);
  return validate(
    PagedCorrelationsSchema,
    data,
    'Invalid PagedCorrelations response',
  ) as PagedCorrelations;
}

export async function getCorrelationCombo(
  client: ExistClient,
  params: GetCorrelationComboParams,
): Promise<Correlation> {
  const qs = buildQuery(params);
  const data = await client.get(`/correlations/combo/${qs}`);
  return validate(CorrelationSchema, data, 'Invalid Correlation response') as Correlation;
}
