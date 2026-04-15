import {describe, it, expect, beforeEach} from 'vitest';

import type {TokenStore} from '../../src/oauth/token-store.js';

import {MemoryTokenStore} from '../../src/oauth/memory-store.js';

describe('MemoryTokenStore', () => {
  let store: MemoryTokenStore;

  beforeEach(() => {
    store = new MemoryTokenStore();
  });

  it('returns null for access token when empty', () => {
    expect(store.getAccessToken()).toBeNull();
  });

  it('returns null for refresh token when empty', () => {
    expect(store.getRefreshToken()).toBeNull();
  });

  it('stores and retrieves access token', () => {
    const tokens = {
      access_token: 'test-access',
      token_type: 'Bearer',
    };
    store.setTokens(tokens);
    expect(store.getAccessToken()).toBe('test-access');
  });

  it('stores and retrieves refresh token', () => {
    const tokens = {
      access_token: 'test-access',
      refresh_token: 'test-refresh',
      token_type: 'Bearer',
    };
    store.setTokens(tokens);
    expect(store.getRefreshToken()).toBe('test-refresh');
  });

  it('clears tokens on clear()', () => {
    store.setTokens({access_token: 'test', token_type: 'Bearer'});
    store.clear();
    expect(store.getAccessToken()).toBeNull();
    expect(store.getRefreshToken()).toBeNull();
  });

  it('overwrites previous tokens on setTokens', () => {
    store.setTokens({access_token: 'first', token_type: 'Bearer'});
    store.setTokens({access_token: 'second', token_type: 'Bearer'});
    expect(store.getAccessToken()).toBe('second');
  });
});

describe('TokenStore interface (MemoryTokenStore)', () => {
  it('implements TokenStore contract', () => {
    const store: TokenStore = new MemoryTokenStore();
    expect(typeof store.setTokens).toBe('function');
    expect(typeof store.getAccessToken).toBe('function');
    expect(typeof store.getRefreshToken).toBe('function');
    expect(typeof store.clear).toBe('function');
  });
});
