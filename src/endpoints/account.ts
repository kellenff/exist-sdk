import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';
import type {UserProfile} from '../types.js';

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

export async function getProfile(client: ExistClient): Promise<UserProfile> {
  const data = await client.get('/accounts/profile/');
  return validate(UserProfileSchema, data, 'Invalid UserProfile response');
}
