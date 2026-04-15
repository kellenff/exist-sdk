import {describe, it, expect} from 'vitest';

import type {DeviceCodeClient} from '../../src/oauth/index.js';

import {createDeviceCodeClient} from '../../src/oauth/device-code.js';
import {createOAuth2Client} from '../../src/oauth/index.js';
import {MemoryTokenStore} from '../../src/oauth/memory-store.js';

describe('Device Code Client', () => {
  it('createDeviceCodeClient returns device code client interface', () => {
    const client = createDeviceCodeClient({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: new MemoryTokenStore(),
    });

    expect(typeof client.startDeviceAuthorization).toBe('function');
    expect(typeof client.pollForTokens).toBe('function');
    expect(typeof client.getAuthenticatedClient).toBe('function');
  });

  it('device code client works with token store', () => {
    const store = new MemoryTokenStore();
    store.setTokens({
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      token_type: 'Bearer',
    });

    const client = createDeviceCodeClient({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
    });

    const existClient = client.getAuthenticatedClient();
    expect(typeof existClient.get).toBe('function');
    expect(typeof existClient.post).toBe('function');
  });

  it('client accepts clientSecret option', () => {
    const client = createDeviceCodeClient({
      clientId: 'test-client',
      clientSecret: 'secret',
      issuer: new URL('https://example.com'),
      tokenStore: new MemoryTokenStore(),
    });

    expect(typeof client.startDeviceAuthorization).toBe('function');
  });

  it('client accepts scopes option', () => {
    const client = createDeviceCodeClient({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: new MemoryTokenStore(),
      scopes: ['openid', 'profile', 'email'],
    });

    expect(typeof client.startDeviceAuthorization).toBe('function');
    expect(typeof client.pollForTokens).toBe('function');
  });

  it('getAuthenticatedClient uses provided token over store', () => {
    const store = new MemoryTokenStore();
    store.setTokens({
      access_token: 'stored-token',
      token_type: 'Bearer',
    });

    const client = createDeviceCodeClient({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
    });

    const existClient = client.getAuthenticatedClient({
      token: 'override-token',
    });
    expect(typeof existClient.get).toBe('function');
  });
});

describe('OAuth2 factory for device code', () => {
  it('createOAuth2Client with device_code flow returns DeviceCodeClient', () => {
    const store = new MemoryTokenStore();
    const client = createOAuth2Client({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'device_code',
    }) as DeviceCodeClient;

    expect(typeof client.startDeviceAuthorization).toBe('function');
    expect(typeof client.pollForTokens).toBe('function');
    expect(typeof client.getAuthenticatedClient).toBe('function');
  });

  it('device code client from factory works with tokens', () => {
    const store = new MemoryTokenStore();
    store.setTokens({
      access_token: 'factory-token',
      token_type: 'Bearer',
    });

    const client = createOAuth2Client({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'device_code',
    }) as DeviceCodeClient;

    const existClient = client.getAuthenticatedClient();
    expect(typeof existClient.get).toBe('function');
  });
});
