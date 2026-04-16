export {createClient} from './client.js';
export type {ExistClient, ClientOptions, ExistError, ApiToken, UserToken} from './client.js';
export {ApiTokenSchema, UserTokenSchema} from './client.js';
export type {
  UserProfile,
  AttributeWithValues,
  PagedAttributesWithValues,
  PagedAverages,
  AverageRow,
  PagedCorrelations,
  Correlation,
  AcquireOrReleaseItem,
  CreateAttributeItem,
  AttributeValueUpdate,
  AttributeIncrement,
} from './types.js';
export {getProfile} from './endpoints/account.js';
export {getAttributesWithValues} from './endpoints/attributes.js';
export {getAverages} from './endpoints/averages.js';
export {getCorrelations, getCorrelationCombo} from './endpoints/correlations.js';
export {
  acquireAttributes,
  releaseAttributes,
  createAttributes,
  updateAttributeValues,
  incrementAttributeValues,
} from './endpoints/writes.js';
export {exchangeSimpleToken} from './endpoints/auth.js';

export type {TokenStore} from './oauth/token-store.js';
export {MemoryTokenStore, FileTokenStore} from './oauth/index.js';
export type {
  AuthorizationCodeClientOptions,
  AuthorizationCodeClient,
  DeviceCodeClientOptions,
  DeviceCodeClient,
  OAuth2ClientOptions,
  OAuth2Client,
} from './oauth/index.js';
export {createOAuth2Client} from './oauth/index.js';
