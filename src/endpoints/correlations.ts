import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {Result} from '../types.js';

import {buildQuery, validate} from './_shared.js';

const GetCorrelationsParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  confident: z.union([z.literal(0), z.literal(1)]).optional(),
  attribute: z.string().optional(),
});

const GetCorrelationComboParamsSchema = z.object({
  attribute: z.string(),
  attribute2: z.string(),
});

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

type PagedCorrelations = z.infer<typeof PagedCorrelationsSchema>;
type Correlation = z.infer<typeof CorrelationSchema>;

export async function getCorrelations(
  client: ExistClient,
  params: z.infer<typeof GetCorrelationsParamsSchema> = {},
): Promise<Result<PagedCorrelations>> {
  const qs = buildQuery(params);
  const data = await client.get(`/correlations/${qs}`);
  const validated = validate(PagedCorrelationsSchema, data, 'Invalid PagedCorrelations response');
  return {ok: true, data: validated};
}

export async function getCorrelationCombo(
  client: ExistClient,
  params: z.infer<typeof GetCorrelationComboParamsSchema>,
): Promise<Result<Correlation>> {
  const qs = buildQuery(params);
  const data = await client.get(`/correlations/combo/${qs}`);
  const validated = validate(CorrelationSchema, data, 'Invalid Correlation response');
  return {ok: true, data: validated};
}
