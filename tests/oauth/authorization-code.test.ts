import {describe, it, expect} from 'vitest';

import type {
  AuthorizationCodeClient,
  DeviceCodeClient,
  OAuth2Client,
} from '../../src/oauth/index.js';

import {createAuthorizationCodeClient} from '../../src/oauth/authorization-code.js';
import {createDeviceCodeClient} from '../../src/oauth/device-code.js';
import {createOAuth2Client} from '../../src/oauth/index.js';
import {MemoryTokenStore} from '../../src/oauth/memory-store.js';

describe('OAuth2 Client Factory', () => {
  it('createOAuth2Client returns authorization code client for authorization_code flow', () => {
    const store = new MemoryTokenStore();
    const client = createOAuth2Client({
      clientId: 'test-client',
      redirectUri: 'https://app.example.com/callback',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'authorization_code',
    });

    expect(typeof client.createAuthorizationURL).toBe('function');
    expect(typeof client.handleAuthorizationCallback).toBe('function');
    expect(typeof client.getAuthenticatedClient).toBe('function');
  });

  it('createOAuth2Client returns device code client for device_code flow', () => {
    const store = new MemoryTokenStore();
    const client = createOAuth2Client({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'device_code',
    });

    expect(typeof client.startDeviceAuthorization).toBe('function');
    expect(typeof client.pollForTokens).toBe('function');
    expect(typeof client.getAuthenticatedClient).toBe('function');
  });

  it('authorization code client has correct interface shape', () => {
    const store = new MemoryTokenStore();
    const client = createOAuth2Client({
      clientId: 'test-client',
      redirectUri: 'https://app.example.com/callback',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'authorization_code',
    }) as AuthorizationCodeClient;

    expect(typeof client.createAuthorizationURL).toBe('function');
    expect(typeof client.handleAuthorizationCallback).toBe('function');
    expect(typeof client.getAuthenticatedClient).toBe('function');
    expect(client.createAuthorizationURL).toBeDefined();
  });

  it('device code client has correct interface shape', () => {
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

  it('getAuthenticatedClient works on both client types', () => {
    const store = new MemoryTokenStore();
    store.setTokens({access_token: 'test-token', token_type: 'Bearer'});

    const authClient = createOAuth2Client({
      clientId: 'test-client',
      redirectUri: 'https://app.example.com/callback',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'authorization_code',
    });

    const existClient = authClient.getAuthenticatedClient();
    expect(typeof existClient.get).toBe('function');
    expect(typeof existClient.post).toBe('function');

    const deviceClient = createOAuth2Client({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'device_code',
    });

    const deviceExistClient = deviceClient.getAuthenticatedClient();
    expect(typeof deviceExistClient.get).toBe('function');
    expect(typeof deviceExistClient.post).toBe('function');
  });

  it('OAuth2Client interface allows optional methods based on flow', () => {
    const store = new MemoryTokenStore();
    const client = createOAuth2Client({
      clientId: 'test-client',
      redirectUri: 'https://app.example.com/callback',
      issuer: new URL('https://example.com'),
      tokenStore: store,
      flow: 'authorization_code',
    }) as OAuth2Client;

    // Authorization code client won't have device-specific methods
    expect(client.startDeviceAuthorization).toBeUndefined();
    expect(client.pollForTokens).toBeUndefined();
    // But will have auth code specific methods
    expect(typeof client.createAuthorizationURL).toBe('function');
    expect(typeof client.handleAuthorizationCallback).toBe('function');
  });
});

describe('MemoryTokenStore with OAuth2 clients', () => {
  it('token store works with authorization code client', () => {
    const store = new MemoryTokenStore();
    store.setTokens({
      access_token: 'auth-code-token',
      refresh_token: 'auth-code-refresh',
      token_type: 'Bearer',
    });

    const client = createAuthorizationCodeClient({
      clientId: 'test-client',
      redirectUri: 'https://app.example.com/callback',
      issuer: new URL('https://example.com'),
      tokenStore: store,
    });

    const existClient = client.getAuthenticatedClient();
    expect(typeof existClient.get).toBe('function');
  });

  it('token store works with device code client', () => {
    const store = new MemoryTokenStore();
    store.setTokens({
      access_token: 'device-code-token',
      refresh_token: 'device-code-refresh',
      token_type: 'Bearer',
    });

    const client = createDeviceCodeClient({
      clientId: 'test-client',
      issuer: new URL('https://example.com'),
      tokenStore: store,
    });

    const existClient = client.getAuthenticatedClient();
    expect(typeof existClient.get).toBe('function');
  });
});
