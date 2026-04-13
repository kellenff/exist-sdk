export { createClient } from "./client.js";
export type { ExistClient, ClientOptions, ExistError } from "./client.js";
export type {
  UserProfile,
  AttributeWithValues,
  PagedAttributesWithValues,
} from "./types.js";
export { getProfile } from "./endpoints/account.js";
export { getAttributesWithValues } from "./endpoints/attributes.js";
export { exchangeSimpleToken } from "./endpoints/auth.js";
