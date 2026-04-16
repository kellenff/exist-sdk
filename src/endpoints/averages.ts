import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {Result} from '../types.js';

import {buildQuery, validate} from './_shared.js';

const GetAveragesParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  attributes: z.string().optional(),
  include_historical: z.union([z.literal(0), z.literal(1)]).optional(),
});

type GetAveragesParams = z.infer<typeof GetAveragesParamsSchema>;

const PagedAveragesSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown()),
});

type PagedAverages = z.infer<typeof PagedAveragesSchema>;

export async function getAverages(
  client: ExistClient,
  params: GetAveragesParams = {},
): Promise<Result<PagedAverages>> {
  const qs = buildQuery(params);
  const data = await client.get(`/averages/${qs}`);
  const validated = validate(PagedAveragesSchema, data, 'Invalid PagedAverages response');
  return {ok: true, data: validated};
}
