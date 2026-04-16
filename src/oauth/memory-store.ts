import type {components} from '../types.js';
import type {TokenStore} from './token-store.js';

type OAuthAccessTokenResponse = components['schemas']['OAuthAccessTokenResponse'];

/**
 * In-memory implementation of TokenStore.
 * Uses a Map for runtime-agnostic storage.
 * Note: Tokens are lost when the process exits.
 */
export class MemoryTokenStore implements TokenStore {
  private tokens: Map<string, string | null> = new Map();

  getAccessToken(): string | null {
    return this.tokens.get('accessToken') ?? null;
  }

  getRefreshToken(): string | null {
    return this.tokens.get('refreshToken') ?? null;
  }

  setTokens(tokens: OAuthAccessTokenResponse): void {
    this.tokens.set('accessToken', tokens.access_token ?? null);
    this.tokens.set('refreshToken', tokens.refresh_token ?? null);
  }

  clear(): void {
    this.tokens.clear();
  }
}
