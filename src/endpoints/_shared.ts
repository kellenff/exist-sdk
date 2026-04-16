import {z} from 'zod';

import type {ExistError} from '../client.js';

export {z};

export function buildQuery(params: object): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown, errorMessage: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw {
      status: 422,
      message: errorMessage,
      code: 'VALIDATION_ERROR',
      cause: result.error.issues,
    } as ExistError;
  }
  return result.data;
}
