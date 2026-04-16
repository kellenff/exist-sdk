import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';
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

const PagedAveragesSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown()),
});

export async function getAverages(
  client: ExistClient,
  params: GetAveragesParams = {},
): Promise<PagedAverages> {
  const qs = buildQuery(params);
  const data = await client.get(`/averages/${qs}`);
  return validate(PagedAveragesSchema, data, 'Invalid PagedAverages response') as PagedAverages;
}
