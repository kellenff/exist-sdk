import type {TokenStore} from './token-store.js';

import {createAuthorizationCodeClient} from './authorization-code.js';
import {createDeviceCodeClient} from './device-code.js';
export type {TokenStore} from './token-store.js';
export {MemoryTokenStore} from './memory-store.js';
export {FileTokenStore} from './file-store.js';

export type {
  AuthorizationCodeClientOptions,
  AuthorizationCodeClient,
} from './authorization-code.js';
export {createAuthorizationCodeClient} from './authorization-code.js';

export type {DeviceCodeClientOptions, DeviceCodeClient} from './device-code.js';
export {createDeviceCodeClient} from './device-code.js';

export interface OAuth2ClientOptions {
  clientId: string;
  clientSecret?: string;
  issuer: URL;
  redirectUri?: string;
  tokenStore: TokenStore;
  scopes?: string[];
  flow: 'authorization_code' | 'device_code';
}

export interface OAuth2Client {
  createAuthorizationURL?(state?: string): Promise<URL>;
  handleAuthorizationCallback?(url: URL, state?: string): Promise<void>;
  startDeviceAuthorization?(): Promise<import('oauth4webapi').DeviceAuthorizationResponse>;
  pollForTokens?(
    deviceAuth: import('oauth4webapi').DeviceAuthorizationResponse,
    intervalSeconds?: number,
  ): Promise<void>;
  getAuthenticatedClient(options?: {
    token?: string;
    tokenStore?: TokenStore;
  }): import('../client.js').ExistClient;
}

export function createOAuth2Client(opts: OAuth2ClientOptions): OAuth2Client {
  switch (opts.flow) {
    case 'authorization_code':
      return createAuthorizationCodeClient({
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
        redirectUri: opts.redirectUri!,
        issuer: opts.issuer,
        tokenStore: opts.tokenStore,
        scopes: opts.scopes,
      });
    case 'device_code':
      return createDeviceCodeClient({
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
        issuer: opts.issuer,
        tokenStore: opts.tokenStore,
        scopes: opts.scopes,
      });
  }
}
