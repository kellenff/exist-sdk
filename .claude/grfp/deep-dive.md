# exist-sdk Deep Dive

## What It IS

TypeScript SDK wrapping the [Exist.io](https://exist.io/) HTTP API (v2). Personal analytics platform tracking correlations between habits, mood, and daily activities.

**Package:** `@fromo/exist-sdk` — dual-published to npm and JSR.

---

## Problem Solved

Eliminates raw `fetch` + manual auth headers. Typed endpoint wrappers, reusable `ExistClient`, auto-generated OpenAPI types.

---

## Who It's For

- Developers building Exist-integrated apps/scripts
- Personal automation (tracking data, updating attributes)
- Internal tools at @fromo org

---

## Core Features

| Feature | Location |
|---------|----------|
| `createClient()` | `src/client.ts` |
| `getProfile()` | `src/endpoints/account.ts` |
| `getAttributesWithValues()` | `src/endpoints/attributes.ts` |
| `exchangeSimpleToken()` | `src/endpoints/auth.ts` |
| OpenAPI types auto-generated | `src/types.ts` |

### `client.ts` — Core HTTP Client
- Token auth via `Authorization: Token <token>` header
- Default base URL: `https://exist.io/api/2/`
- Custom `fetch` impl (enables testing/mocking)
- JSON serialization/deserialization
- Typed errors (`ExistError` with status, message, code, cause)
- `get(path)` and `post(path, {body})` only

### `endpoints/account.ts` — User Profile
- `getProfile()` → `UserProfile` (username, name, avatar, timezone, preferences)

### `endpoints/attributes.ts` — Attribute Queries
- `getAttributesWithValues(params)` → `PagedAttributesWithValues`
- Supports: `page`, `limit`, `days`, `groups`, `date_max`, `attributes` filters
- Query string built manually via `buildQuery()`

### `endpoints/auth.ts` — Token Exchange
- `exchangeSimpleToken({username, password})` → `{token: string}`
- Simple token auth only — no OAuth2 yet

---

## Architecture

```
client.ts (ExistClient, createClient)
  ├── get() / post() — raw HTTP
  └── endpoints/ (typed wrappers)
        ├── account.ts — getProfile()
        ├── attributes.ts — getAttributesWithValues()
        └── auth.ts — exchangeSimpleToken()
types.ts — auto-generated from OpenAPI spec (openapi-typescript)
index.ts — public exports
```

**Design:** Thin HTTP layer. Minimal domain logic. Auth separate. Auto-generated types.

---

## What Makes It Unique

1. **Dual registry publish** — npm + JSR simultaneously
2. **Auto-generated OpenAPI types** — `generate-types.ts` script keeps types in sync
3. **Alpha stability warning** — README states API surface unstable
4. **Semantic Release** — conventional commits → automatic npm + JSR releases
5. **Injectable fetch** — `ClientOptions.fetch` enables testability

---

## Tech Stack

- TypeScript 6, Node.js 18+ (native fetch)
- Vite/vitest for testing
- oxlint + oxfmt for lint/format
- Husky pre-commit
- semantic-release for CI/CD
- openapi-typescript for type generation

---

## Key Observations

- SDK is **thin wrapper** — not a full "Exist.js ORM"
- Only 3 endpoints (profile, attributes, token) — **vast API untapped** (correlations, averages, attribute writes, OAuth2)
- README example (`client.attributes.list()`) **doesn't match actual API** — no `attributes.list()` method; should be `getAttributesWithValues(client)`
- No examples for: creating/updating attributes, OAuth2, correlations, averages
- README shows class-based (`new ExistClient`) but code uses factory (`createClient`)