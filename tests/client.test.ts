import {describe, it, expect, vi} from 'vitest';

import {createClient} from '../src/client.js';

describe('createClient', () => {
  it('injects Authorization header with Token prefix', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({username: 'test'}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc123', fetch: mockFetch});
    await client.get('/accounts/profile/');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/accounts/profile/',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Token abc123',
        }),
      }),
    );
  });

  it('throws ExistError on non-2xx response', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({message: 'Invalid token'}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'bad', fetch: mockFetch});

    await expect(client.get('/accounts/profile/')).rejects.toMatchObject({
      status: 401,
      message: 'Invalid token',
    });
  });

  it('throws ExistError on rate limit (429)', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: false,
          status: 429,
          json: () => Promise.resolve({message: 'Rate limited'}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});

    await expect(client.get('/accounts/profile/')).rejects.toMatchObject({
      status: 429,
      message: 'Rate limited',
    });
  });

  it('allows custom baseUrl', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: 'abc',
      baseUrl: 'https://custom.example.com/api/2/',
      fetch: mockFetch,
    });
    await client.get('/accounts/profile/');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://custom.example.com/api/2/accounts/profile/',
      expect.any(Object),
    );
  });

  it('serializes request body as JSON', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({token: 'abc123'}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await client.post('/auth/simple-token/', {
      body: {username: 'user', password: 'pass'},
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/auth/simple-token/',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({username: 'user', password: 'pass'}),
      }),
    );
  });
});
