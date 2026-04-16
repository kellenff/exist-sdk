import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {PagedAttributesWithValues} from '../types.js';

import {ISODateSchema} from '../types.js';
import {validate, buildQuery} from './_shared.js';

const GetAttributesParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  days: z.number().optional(),
  groups: z.string().optional(),
  date_max: ISODateSchema.optional(),
  attributes: z.string().optional(),
});

export type GetAttributesParams = z.infer<typeof GetAttributesParamsSchema>;

const PagedAttributesWithValuesSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown()),
});

export async function getAttributesWithValues(
  client: ExistClient,
  params: GetAttributesParams = {},
): Promise<PagedAttributesWithValues> {
  const qs = buildQuery(params);
  const data = await client.get(`/attributes/with-values/${qs}`);
  return validate(
    PagedAttributesWithValuesSchema,
    data,
    'Invalid PagedAttributesWithValues response',
  ) as PagedAttributesWithValues;
}
