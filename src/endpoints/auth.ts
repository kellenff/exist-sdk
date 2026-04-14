import type {ExistClient} from '../client.js';

interface SimpleTokenRequest {
  username: string;
  password: string;
}

export async function exchangeSimpleToken(
  client: ExistClient,
  credentials: SimpleTokenRequest,
): Promise<{token: string}> {
  return client.post('/auth/simple-token/', {body: credentials}) as Promise<{
    token: string;
  }>;
}
