import {describe, it, expect, vi} from 'vitest';

import {createClient} from '../../src/client.js';
import {getAverages} from '../../src/endpoints/averages.js';

describe('getAverages', () => {
  it('calls GET /averages/ with default pagination', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              count: 0,
              next: null,
              previous: null,
              results: [],
            }),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getAverages(client);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/averages/',
      expect.objectContaining({method: 'GET'}),
    );
  });

  it('passes query params for page, limit, attributes filters', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              count: 0,
              next: null,
              previous: null,
              results: [],
            }),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getAverages(client, {
      page: 2,
      limit: 50,
      attributes: 'mood',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/averages/?page=2&limit=50&attributes=mood',
      expect.any(Object),
    );
  });

  it('passes include_historical param', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              count: 0,
              next: null,
              previous: null,
              results: [],
            }),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getAverages(client, {include_historical: 1});

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/averages/?include_historical=1',
      expect.any(Object),
    );
  });
});
