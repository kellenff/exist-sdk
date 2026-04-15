import {describe, it, expect, vi} from 'vitest';

import {createClient} from '../../src/client.js';
import {getCorrelations, getCorrelationCombo} from '../../src/endpoints/correlations.js';

describe('getCorrelations', () => {
  it('calls GET /correlations/ with default pagination', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({count: 0, results: []}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getCorrelations(client);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/correlations/',
      expect.objectContaining({method: 'GET'}),
    );
  });

  it('passes query params for page, limit, confident, attribute filters', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({count: 0, results: []}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getCorrelations(client, {
      page: 2,
      limit: 50,
      confident: 1,
      attribute: 'mood',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/correlations/?page=2&limit=50&confident=1&attribute=mood',
      expect.any(Object),
    );
  });
});

describe('getCorrelationCombo', () => {
  it('calls GET /correlations/combo/ with attribute pair', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              date: '2024-01-01',
              attribute: 'mood',
              attribute2: 'sleep',
              value: 0.75,
            }),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({token: 'abc', fetch: mockFetch});
    await getCorrelationCombo(client, {
      attribute: 'mood',
      attribute2: 'sleep',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/correlations/combo/?attribute=mood&attribute2=sleep',
      expect.any(Object),
    );
  });
});
