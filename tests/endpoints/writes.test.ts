import {describe, it, expect, vi} from 'vitest';

import {ApiTokenSchema, createClient} from '../../src/client.js';
import {
  acquireAttributes,
  releaseAttributes,
  createAttributes,
  updateAttributeValues,
  incrementAttributeValues,
} from '../../src/endpoints/writes.js';

describe('acquireAttributes', () => {
  it('calls POST /attributes/acquire/ with items', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await acquireAttributes(client, [{name: 'mood', manual: true}]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/acquire/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{name: 'mood', manual: true}]),
      }),
    );
  });
});

describe('releaseAttributes', () => {
  it('calls POST /attributes/release/ with items', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await releaseAttributes(client, [{name: 'mood'}]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/release/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{name: 'mood'}]),
      }),
    );
  });
});

describe('createAttributes', () => {
  it('calls POST /attributes/create/ with items', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({success: []}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await createAttributes(client, [
      {label: 'Weight', value_type: 1, group: 'health', manual: true},
    ]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/create/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{label: 'Weight', value_type: 1, group: 'health', manual: true}]),
      }),
    );
  });
});

describe('updateAttributeValues', () => {
  it('calls POST /attributes/update/ with items', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await updateAttributeValues(client, [{name: 'weight', date: '2024-01-01', value: 180}]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/update/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{name: 'weight', date: '2024-01-01', value: 180}]),
      }),
    );
  });
});

describe('incrementAttributeValues', () => {
  it('calls POST /attributes/increment/ with items', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({success: [{name: 'steps', current: 5000}]}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await incrementAttributeValues(client, [{name: 'steps', value: 1000}]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/increment/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{name: 'steps', value: 1000}]),
      }),
    );
  });

  it('passes optional date when provided', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({success: []}),
        }) as unknown as Promise<Response>,
    );

    const client = createClient({
      token: ApiTokenSchema.parse('abc'),
      fetch: mockFetch,
    });
    await incrementAttributeValues(client, [{name: 'steps', value: 500, date: '2024-01-01'}]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://exist.io/api/2/attributes/increment/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([{name: 'steps', value: 500, date: '2024-01-01'}]),
      }),
    );
  });
});
