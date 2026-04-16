import {z} from 'zod';

export interface ExistError {
  status: number;
  message: string;
  code?: string;
  cause?: unknown;
}

// Branded types for token safety
export type ApiToken = z.infer<typeof ApiTokenSchema> & {
  readonly __brand: 'ApiToken';
};
export type UserToken = z.infer<typeof UserTokenSchema> & {
  readonly __brand: 'UserToken';
};

export const ApiTokenSchema = z.string().brand<'ApiToken'>();
export const UserTokenSchema = z.string().brand<'UserToken'>();

export interface ClientOptions {
  token: ApiToken;
  authScheme?: 'Bearer' | 'Token';
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface ExistClient {
  get(path: string): Promise<unknown>;
  post(path: string, opts?: {body?: unknown}): Promise<unknown>;
}

export function createClient(opts: ClientOptions): ExistClient {
  const {
    token,
    authScheme = 'Token',
    baseUrl = 'https://exist.io/api/2/',
    fetch: fetchImpl = fetch,
  } = opts;

  async function request(path: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${baseUrl.replace(/\/$/, '')}${path}`;
    const headers: Record<string, string> = {
      Authorization: `${authScheme} ${token}`,
    };

    const {body, ...rest} = options;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetchImpl(url, {
      ...rest,
      headers: {...headers, ...rest.headers},
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? (data as {message: string}).message
        : response.statusText;

    if (!response.ok) {
      const err: ExistError = {
        status: response.status,
        message,
        cause: data,
      };
      // Extract code if present in response body
      if (typeof data === 'object' && data !== null && 'code' in data) {
        err.code = String((data as {code: unknown}).code);
      }
      throw err;
    }

    return data;
  }

  return {
    get: (path) => request(path, {method: 'GET'}),
    post: (path, {body} = {}) => request(path, {method: 'POST', body: body as BodyInit}),
  };
}
