import {
  type AuthorizationServer,
  type Client,
  type DeviceAuthorizationResponse,
  deviceAuthorizationRequest,
  processDeviceAuthorizationResponse,
  deviceCodeGrantRequest,
  processDeviceCodeResponse,
  discoveryRequest,
  processDiscoveryResponse,
  None,
  ClientSecretPost,
} from 'oauth4webapi';

import type {ExistClient} from '../client.js';
import type {TokenStore} from './token-store.js';

import {ApiTokenSchema, createClient} from '../client.js';

export interface DeviceCodeClientOptions {
  clientId: string;
  clientSecret?: string;
  issuer: URL;
  tokenStore: TokenStore;
  scopes?: string[];
}

export interface DeviceCodeClient {
  startDeviceAuthorization(): Promise<DeviceAuthorizationResponse>;
  pollForTokens(deviceAuth: DeviceAuthorizationResponse, intervalSeconds?: number): Promise<void>;
  getAuthenticatedClient(options?: {token?: string; tokenStore?: TokenStore}): ExistClient;
}

function resolveAuthMethod(clientSecret?: string) {
  if (!clientSecret) {
    return None();
  }
  return ClientSecretPost(clientSecret);
}

export function createDeviceCodeClient(opts: DeviceCodeClientOptions): DeviceCodeClient {
  const {clientId, clientSecret, issuer, tokenStore, scopes = []} = opts;

  let as: AuthorizationServer | undefined;
  const client: Client = {client_id: clientId};
  const clientAuth = resolveAuthMethod(clientSecret);

  async function resolveServerMetadata(): Promise<AuthorizationServer> {
    if (as) return as;
    const response = await discoveryRequest(issuer, {algorithm: 'oauth2'});
    as = await processDiscoveryResponse(issuer, response);
    return as;
  }

  return {
    async startDeviceAuthorization(): Promise<DeviceAuthorizationResponse> {
      const server = await resolveServerMetadata();

      const parameters = new URLSearchParams();
      parameters.set('scope', scopes.join(' '));

      const response = await deviceAuthorizationRequest(server, client, clientAuth, parameters);

      return processDeviceAuthorizationResponse(server, client, response);
    },

    async pollForTokens(
      deviceAuth: DeviceAuthorizationResponse,
      intervalSeconds?: number,
    ): Promise<void> {
      const server = await resolveServerMetadata();
      const interval = intervalSeconds ?? deviceAuth.interval ?? 5;

      while (true) {
        // eslint-disable-next-line no-await-in-loop -- Device flow requires sequential polling
        const grant = await deviceCodeGrantRequest(
          server,
          client,
          clientAuth,
          deviceAuth.device_code,
        );

        // eslint-disable-next-line no-await-in-loop -- Device flow requires sequential polling
        const result = await processDeviceCodeResponse(server, client, grant);

        if (result.access_token) {
          tokenStore.setTokens(result);
          return;
        }

        // eslint-disable-next-line no-await-in-loop -- Interval between polls is required
        await new Promise((resolve) => setTimeout(resolve, interval * 1000));
      }
    },

    getAuthenticatedClient(clientOpts?: {token?: string; tokenStore?: TokenStore}): ExistClient {
      const store = clientOpts?.tokenStore ?? tokenStore;
      const token = clientOpts?.token ?? store.getAccessToken();
      return createClient({
        token: ApiTokenSchema.parse(token!),
        authScheme: 'Bearer',
      });
    },
  };
}
