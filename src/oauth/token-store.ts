import type {components} from '../types.js';

type OAuthAccessTokenResponse = components['schemas']['OAuthAccessTokenResponse'];

/**
 * Interface for OAuth2 token storage.
 * Implementations should be runtime-agnostic (Node, Deno, Bun).
 */
export interface TokenStore {
  /**
   * Retrieve the stored access token.
   * @returns The access token string, or null if not set.
   */
  getAccessToken(): string | null;

  /**
   * Retrieve the stored refresh token.
   * @returns The refresh token string, or null if not set.
   */
  getRefreshToken(): string | null;

  /**
   * Store OAuth2 tokens from an access token response.
   * @param tokens - The OAuthAccessTokenResponse containing tokens to store.
   */
  setTokens(tokens: OAuthAccessTokenResponse): void;

  /**
   * Clear all stored tokens.
   */
  clear(): void;
}
