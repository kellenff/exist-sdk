import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';
import type {PagedAttributesWithValues} from '../types.js';

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
