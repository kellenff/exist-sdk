import type {ExistClient} from '../client.js';
import type {UserProfile} from '../types.js';

export async function getProfile(client: ExistClient): Promise<UserProfile> {
  return client.get('/accounts/profile/') as Promise<UserProfile>;
}
