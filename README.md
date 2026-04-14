# exist-sdk

**TypeScript SDK for [exist.io](https://exist.io/) — track everything, connect everywhere.**

[![npm](https://img.shields.io/npm/v/@fromo/exist-sdk)](https://www.npmjs.com/package/@fromo/exist-sdk)
[![JSR](https://img.shields.io/badge/jsr-%40fromo%2Fexist--sdk-blue)](https://jsr.io/@fromo/exist-sdk)
[![License](https://img.shields.io/github/license/kellenff/exist-sdk)](LICENSE)

---

## Status: Alpha

Working:

- `createClient()` — client factory
- `getProfile()` — user profile
- `getAttributesWithValues()` — paged attribute values with filters
- `exchangeSimpleToken()` — username/password → API token

Not yet implemented:

- Correlations, averages, attribute writes (update/increment/create), OAuth2

Full API types auto-generated from OpenAPI spec.

---

## Installation

**npm:**

```sh
npm install @fromo/exist-sdk
```

**JSR (Deno, Bun):**

```ts
import {createClient} from 'jsr:@fromo/exist-sdk';
```

---

## Quick Start

```ts
import {createClient, exchangeSimpleToken, getProfile} from '@fromo/exist-sdk';

// 1. Exchange credentials for a token (do this once, token is long-lived)
const {token} = await exchangeSimpleToken({
  username: process.env.EXIST_USERNAME!,
  password: process.env.EXIST_PASSWORD!,
});

// 2. Create client with token
const client = createClient({token});

// 3. Use typed endpoint wrappers
const profile = await getProfile(client);
console.log(`Hello, ${profile.username}`);
```

---

## Usage

### User Profile

```ts
import {createClient, getProfile} from '@fromo/exist-sdk';
import type {UserProfile} from '@fromo/exist-sdk/types';

const client = createClient({token: process.env.EXIST_TOKEN!});

const profile: UserProfile = await getProfile(client);
console.log(profile.first_name, profile.last_name);
```

### Attribute Values

```ts
import {createClient, getAttributesWithValues} from '@fromo/exist-sdk';
import type {PagedAttributesWithValues} from '@fromo/exist-sdk/types';

const client = createClient({token: process.env.EXIST_TOKEN!});

// Fetch last 7 days of attribute values
const attributes: PagedAttributesWithValues = await getAttributesWithValues(client, {
  days: 7,
  limit: 50,
});

for (const attr of attributes.results ?? []) {
  console.log(`${attr.label}: ${attr.values?.length} values`);
}
```

### Error Handling

All errors are typed as `ExistError`:

```ts
import {createClient, getProfile} from '@fromo/exist-sdk';
import type {ExistError} from '@fromo/exist-sdk';

const client = createClient({token: process.env.EXIST_TOKEN!});

try {
  await getProfile(client);
} catch (err) {
  const e = err as ExistError;
  console.error(e.status, e.message, e.code);
}
```

---

## Authentication

### Simple Token (recommended for scripts)

Exchange `username` + `password` for a long-lived token via `exchangeSimpleToken()`. Store the token and reuse it — no need to re-authenticate on every run.

```ts
const {token} = await exchangeSimpleToken(client, {
  username: 'your-username',
  password: 'your-password',
});
```

### Getting a Token Manually

Generate a token at [exist.io](https://exist.io/account/api/) → API Access. Then:

```ts
const client = createClient({token: 'your-token'});
```

### OAuth2 (not yet implemented)

Full OAuth2 flow is defined in the OpenAPI spec but not yet wrapped. Follow the [official OAuth2 guide](https://developer.exist.io/oauth2/) for now.

---

## Requirements

- Node.js 18+ (native `fetch`)
- An [exist.io](https://exist.io/) account

---

## API Reference

Full API docs: [developer.exist.io](https://developer.exist.io/reference/)

TypeScript types generated from OpenAPI spec — see `src/types.ts`.

---

## Roadmap

What's coming:

- Full read coverage (averages, correlations)
- Write operations (attribute update, increment, create)
- OAuth2 authentication flow
- React Query / SWR hooks

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

---

## License

[MIT](LICENSE)
