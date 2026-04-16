import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';

const SimpleTokenRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const SimpleTokenResponseSchema = z.object({
  token: z.string(),
});

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

export async function exchangeSimpleToken(
  client: ExistClient,
  credentials: {username: string; password: string},
): Promise<{token: string}> {
  const parsed = validate(
    SimpleTokenRequestSchema,
    credentials,
    'Invalid exchangeSimpleToken input',
  );
  const data = await client.post('/auth/simple-token/', {body: parsed});
  return validate(SimpleTokenResponseSchema, data, 'Invalid SimpleToken response');
}
