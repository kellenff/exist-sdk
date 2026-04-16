import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {Result} from '../types.js';

import {validate} from './_shared.js';

const UserProfileSchema = z.object({
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().optional(),
  joined: z.string(),
  timezone: z.string().optional(),
  api_token: z.string().optional(),
  default_color: z.string().optional(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export async function getProfile(client: ExistClient): Promise<Result<UserProfile>> {
  const data = await client.get('/accounts/profile/');
  const validated = validate(UserProfileSchema, data, 'Invalid UserProfile response');
  return {ok: true, data: validated};
}
