import {describe, it, expect, vi} from 'vitest';

import {createClient} from '../../src/client.js';
import {getProfile} from '../../src/endpoints/account.js';

describe('getProfile', () => {
  it('calls GET /accounts/profile/', async () => {
    const mockProfile = {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      joined: '2024-01-01T00:00:00Z',
      timezone: 'UTC',
    };

    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockProfile),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    const result = await getProfile(client);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/accounts/profile/',
      expect.objectContaining({
        headers: expect.objectContaining({Authorization: 'Token abc'}),
      }),
    );
    expect(result).toEqual(mockProfile);
  });
});
