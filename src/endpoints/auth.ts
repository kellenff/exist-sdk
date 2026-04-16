import {z} from 'zod';

import type {ExistClient} from '../client.js';

import {validate} from './_shared.js';

const SimpleTokenRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const SimpleTokenResponseSchema = z.object({
  token: z.string(),
});

type SimpleTokenRequest = z.infer<typeof SimpleTokenRequestSchema>;
type SimpleTokenResponse = z.infer<typeof SimpleTokenResponseSchema>;

export async function exchangeSimpleToken(
  client: ExistClient,
  credentials: SimpleTokenRequest,
): Promise<SimpleTokenResponse> {
  const parsed = validate(
    SimpleTokenRequestSchema,
    credentials,
    'Invalid exchangeSimpleToken input',
  );
  const data = await client.post('/auth/simple-token/', {body: parsed});
  return validate(SimpleTokenResponseSchema, data, 'Invalid SimpleToken response');
}
