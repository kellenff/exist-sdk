# exist-sdk

**The type-safe SDK for the quantified self.**

[![npm](https://img.shields.io/npm/v/@fromo/exist-sdk)](https://www.npmjs.com/package/@fromo/exist-sdk)
[![JSR](https://img.shields.io/badge/jsr-%40fromo%2Fexist--sdk-blue)](https://jsr.io/@fromo/exist-sdk)
[![Build](https://img.shields.io/github/actions/workflow/status/kellenff/exist-sdk/ci.yml)](https://github.com/kellenff/exist-sdk)
[![Types](https://img.shields.io/badge/types-typescript-blue)](src/types.ts)
[![License](https://img.shields.io/github/license/kellenff/exist-sdk)](LICENSE)

TypeScript-first, runtime-validated SDK for the [exist.io](https://exist.io/) API. Supports Node.js, Deno, and Bun.

---

## Installation

| Runtime    | Install                              |
| ---------- | ------------------------------------ |
| Node.js    | `npm install @fromo/exist-sdk`       |
| Deno / Bun | `import from 'jsr:@fromo/exist-sdk'` |

Requires Node.js 18+ (or any runtime with native `fetch`).

---

## Quick Start

```ts
import {createClient, exchangeSimpleToken, getProfile} from '@fromo/exist-sdk';

const {token} = await exchangeSimpleToken({
  username: process.env.EXIST_USERNAME!,
  password: process.env.EXIST_PASSWORD!,
});

const client = createClient({token});
const profile = await getProfile(client);
console.log(profile.username);
```

---

## Why exist-sdk?

You could write `fetch()` calls to the exist.io API. You could manage token auth, response parsing, and error handling yourself. Or you could use a library that does all of that — with type safety, runtime validation, and PKCE-only OAuth2 built in.

exist-sdk validates every API response against a Zod schema at runtime. If exist.io changes a response shape, you'll get a typed error immediately — not a silent `undefined` or a cryptic `data.whatev` failure six hours later.

---

## Features

- **Full API coverage** — Profile, attributes, averages, correlations, and write operations
- **Runtime validation** — All responses validated with Zod; catches API mismatches before they crash your app
- **PKCE-only OAuth2** — Authorization code and device code flows; no insecure fallback
- **Branded token types** — `ApiToken` and `UserToken` are distinct types; TypeScript won't let you mix them
- **Multi-runtime** — Same codebase for Node.js, Deno, and Bun via JSR
- **Auto-generated types** — Types stay in sync with the API via `openapi-typescript`

---

## Authentication

### Simple Token

Best for scripts and CLIs. Exchange credentials once, store the token, reuse it:

```ts
const {token} = await exchangeSimpleToken({
  username: 'your-username',
  password: 'your-password',
});

const client = createClient({token});
```

Or create a client with a token you generated manually at [exist.io/account/api/](https://exist.io/account/api/):

```ts
const client = createClient({token: 'your-token'});
```

### OAuth2

> [!WARNING]
> This SDK only supports OAuth2 with PKCE. Flows without PKCE are not supported. This is intentional — PKCE protects your users' data even if your client's credentials are exposed.

**Authorization code flow** (for web apps):

```ts
import {createOAuth2Client, FileTokenStore} from '@fromo/exist-sdk';

const oauth2 = createOAuth2Client({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  issuer: new URL('https://exist.io/'),
  redirectUri: 'https://your-app.com/callback',
  tokenStore: new FileTokenStore('.exist-tokens.json'),
  flow: 'authorization_code',
});

// 1. Redirect the user to the authorization URL
const authUrl = await oauth2.createAuthorizationURL();
console.log(authUrl);

// 2. Handle the callback — the SDK exchanges the code for tokens
await oauth2.handleAuthorizationCallback(new URL(callbackUrl));

// 3. Get an authenticated client
const client = oauth2.getAuthenticatedClient();
```

**Device code flow** (for CLIs and terminal apps):

```ts
const oauth2 = createOAuth2Client({
  clientId: 'your-client-id',
  issuer: new URL('https://exist.io/'),
  tokenStore: new MemoryTokenStore(),
  flow: 'device_code',
});

const deviceAuth = await oauth2.startDeviceAuthorization();
console.log(`Open ${deviceAuth.verification_uri_complete} and enter code ${deviceAuth.user_code}`);

await oauth2.pollForTokens(deviceAuth);
const client = oauth2.getAuthenticatedClient();
```

---

## Usage

### User Profile

```ts
import {getProfile} from '@fromo/exist-sdk';
import type {UserProfile} from '@fromo/exist-sdk';

const profile: UserProfile = await getProfile(client);
console.log(profile.first_name, profile.last_name);
```

### Attribute Values

```ts
import {getAttributesWithValues} from '@fromo/exist-sdk';
import type {PagedAttributesWithValues} from '@fromo/exist-sdk';

const attributes: PagedAttributesWithValues = await getAttributesWithValues(client, {
  days: 7,
  limit: 50,
});

for (const attr of attributes.results ?? []) {
  console.log(`${attr.label}: ${attr.values?.length} values`);
}
```

### Averages

```ts
import {getAverages} from '@fromo/exist-sdk';

const averages = await getAverages(client, {limit: 20});
for (const row of averages.results ?? []) {
  console.log(row.attribute, row.value);
}
```

### Correlations

```ts
import {getCorrelations, getCorrelationCombo} from '@fromo/exist-sdk';

// All correlations for the user
const correlations = await getCorrelations(client, {confident: 1});

// Specific attribute pair
const combo = await getCorrelationCombo(client, {
  attribute: 'sleep_duration',
  attribute2: 'mood',
});
```

### Writing Attribute Values

```ts
import {acquireAttributes, updateAttributeValues, incrementAttributeValues} from '@fromo/exist-sdk';

// Start tracking new attributes
await acquireAttributes(client, [{name: 'coffee_cups'}]);

// Update today's value
await updateAttributeValues(client, [{name: 'coffee_cups', date: '2026-04-15', value: 2}]);

// Increment an attribute
await incrementAttributeValues(client, [{name: 'coffee_cups', value: 1}]);
```

---

## Error Handling

All errors are typed as `ExistError`:

```ts
import {getProfile} from '@fromo/exist-sdk';
import type {ExistError} from '@fromo/exist-sdk';

try {
  await getProfile(client);
} catch (err) {
  const e = err as ExistError;
  console.error(e.status, e.message, e.code);
}
```

Runtime Zod validation errors include `cause` with the specific schema failures:

```ts
try {
  await getProfile(client);
} catch (err) {
  const e = err as ExistError;
  if (e.cause) {
    console.error('API shape mismatch:', e.cause);
  }
}
```

---

## Advanced

### Custom `fetch`

```ts
import {createClient} from '@fromo/exist-sdk';

const client = createClient({
  token: 'your-token',
  fetch: customFetchImpl, // e.g., for testing with MSW
});
```

### Multiple Clients

```ts
// Different tokens, same base URL
const clientA = createClient({token: tokenA});
const clientB = createClient({token: tokenB});
```

### Custom Token Store

```ts
import {createOAuth2Client, type TokenStore} from '@fromo/exist-sdk';

const customStore: TokenStore = {
  getAccessToken: () => process.env.EXIST_ACCESS_TOKEN,
  getRefreshToken: () => process.env.EXIST_REFRESH_TOKEN,
  setTokens: (tokens) => {
    /* persist somewhere */
  },
};

const oauth2 = createOAuth2Client({
  clientId: 'your-client-id',
  issuer: new URL('https://exist.io/'),
  tokenStore: customStore,
  flow: 'device_code',
});
```

---

## Requirements

- Node.js 18+ or any runtime with native `fetch`
- An [exist.io](https://exist.io/) account

---

## API Reference

Full API documentation: [developer.exist.io](https://developer.exist.io/reference/)

TypeScript types are generated from the OpenAPI spec in `src/types.ts`. Regenerate with:

```sh
yarn generate-types
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

---

## License

[MIT](LICENSE)
