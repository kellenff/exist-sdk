import {
  type AuthorizationServer,
  type Client,
  authorizationCodeGrantRequest,
  processAuthorizationCodeResponse,
  discoveryRequest,
  processDiscoveryResponse,
  generateRandomState,
  generateRandomCodeVerifier,
  calculatePKCECodeChallenge,
  validateAuthResponse,
  skipStateCheck,
  None,
  ClientSecretPost,
} from 'oauth4webapi';

import type {ExistClient} from '../client.js';
import type {TokenStore} from './token-store.js';

import {createClient} from '../client.js';

export interface AuthorizationCodeClientOptions {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  issuer: URL;
  tokenStore: TokenStore;
  scopes?: string[];
}

export interface AuthorizationCodeClient {
  createAuthorizationURL(state?: string): Promise<URL>;
  handleAuthorizationCallback(url: URL, state?: string): Promise<void>;
  getAuthenticatedClient(options?: {token?: string; tokenStore?: TokenStore}): ExistClient;
}

function resolveAuthMethod(clientSecret?: string) {
  if (!clientSecret) {
    return None();
  }
  return ClientSecretPost(clientSecret);
}

export function createAuthorizationCodeClient(
  opts: AuthorizationCodeClientOptions,
): AuthorizationCodeClient {
  const {clientId, clientSecret, redirectUri, issuer, tokenStore, scopes = []} = opts;

  let as: AuthorizationServer | undefined;
  let codeVerifier: string | undefined;
  let stateGenerated: string | undefined;

  const client: Client = {client_id: clientId};
  const clientAuth = resolveAuthMethod(clientSecret);

  async function resolveServerMetadata(): Promise<AuthorizationServer> {
    if (as) return as;
    const response = await discoveryRequest(issuer, {algorithm: 'oauth2'});
    as = await processDiscoveryResponse(issuer, response);
    return as;
  }

  return {
    async createAuthorizationURL(state?: string): Promise<URL> {
      const server = await resolveServerMetadata();
      stateGenerated = state ?? generateRandomState();

      codeVerifier = generateRandomCodeVerifier();
      const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

      const url = new URL(server.authorization_endpoint!);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('scope', scopes.join(' '));
      url.searchParams.set('code_challenge', codeChallenge);
      url.searchParams.set('code_challenge_method', 'S256');
      url.searchParams.set('state', stateGenerated);

      return url;
    },

    async handleAuthorizationCallback(url: URL, _state?: string): Promise<void> {
      if (!codeVerifier) {
        throw new Error(
          'Authorization callback received without prior createAuthorizationURL call',
        );
      }

      const server = await resolveServerMetadata();

      const params = await validateAuthResponse(
        server,
        client,
        url,
        stateGenerated ?? skipStateCheck,
      );

      const response = await authorizationCodeGrantRequest(
        server,
        client,
        clientAuth,
        params,
        redirectUri,
        codeVerifier,
      );

      const result = await processAuthorizationCodeResponse(server, client, response);

      tokenStore.setTokens(result);
    },

    getAuthenticatedClient(clientOpts?: {token?: string; tokenStore?: TokenStore}): ExistClient {
      const store = clientOpts?.tokenStore ?? tokenStore;
      const token = clientOpts?.token ?? store.getAccessToken();
      return createClient({
        token: token!,
        authScheme: 'Bearer',
      });
    },
  };
}
