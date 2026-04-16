# GRFP Stage 1: Deep Dive — exist-sdk

## What the Project IS

**exist-sdk** is a TypeScript SDK for [exist.io](https://exist.io/) — a personal data tracking platform where users log attributes about their daily life (sleep, exercise, mood, caffeine, etc.) and the service analyzes correlations between habits and outcomes.

The SDK gives developers programmatic, type-safe access to the exist.io REST API v2.

---

## Problem Solved

Exist.io has no official SDK. Developers integrating with it were:
- Writing raw `fetch` calls with manual type handling
- Managing token auth flows (simple token + OAuth2) from scratch
- Validating API responses manually with no schema safety

exist-sdk solves this by providing:
- **Typed endpoint wrappers** — no more `any` responses
- **Auth flow automation** — simple token exchange + full OAuth2 (PKCE, device code)
- **Runtime validation** — Zod schemas catch API shape mismatches
- **Multi-runtime support** — Node.js, Deno, Bun from a single codebase

---

## Who It's For

- **Quantified-self enthusiasts** building custom dashboards or automations
- **Developers integrating exist.io** into personal productivity tools
- **CLI tool authors** who want script-friendly token auth
- **App developers** who need OAuth2 for user-facing integrations

---

## Core Features (Implemented)

| Feature | Status |
|---------|--------|
| Simple token exchange (`exchangeSimpleToken`) | ✅ |
| `getProfile()` — user profile | ✅ |
| `getAttributesWithValues()` — paged attribute history | ✅ |
| `getAverages()` — aggregated averages | ✅ |
| `getCorrelations()` / `getCorrelationCombo()` | ✅ |
| Write operations (acquire/release/create/update/increment) | ✅ |
| OAuth2 Authorization Code flow (PKCE) | ✅ |
| OAuth2 Device Code flow | ✅ |
| Token stores (Memory + File, cross-runtime) | ✅ |
| Auto-generated types from OpenAPI | ✅ |
| Zod runtime validation on all responses | ✅ |
| Branded token types (prevents `ApiToken` ↔ `UserToken` confusion) | ✅ |

---

## Architecture

### Module Map

```
src/
├── client.ts          — createClient(), ExistClient interface, branded token types
├── index.ts           — Public API surface (all re-exports)
├── types.ts           — Auto-generated OpenAPI types (DO NOT EDIT)
├── endpoints/
│   ├── account.ts     — getProfile()
│   ├── attributes.ts  — getAttributesWithValues()
│   ├── averages.ts    — getAverages()
│   ├── correlations.ts — getCorrelations(), getCorrelationCombo()
│   ├── writes.ts      — acquire/release/create/update/increment
│   └── auth.ts        — exchangeSimpleToken()
└── oauth/
    ├── index.ts        — createOAuth2Client() factory
    ├── authorization-code.ts — Full PKCE authorization code flow
    ├── device-code.ts  — Device code flow
    ├── token-store.ts  — TokenStore interface (abstraction boundary)
    ├── memory-store.ts — In-memory token store
    └── file-store.ts   — Cross-runtime file persistence
```

### Key Architectural Decisions

**1. Endpoint pattern — pure functions over class methods**

```ts
const profile = await getProfile(client);
const attrs = await getAttributesWithValues(client, {days: 7, limit: 50});
```

Each endpoint is a standalone async function. No class instantiation overhead. Easy to test, easy to tree-shake.

**2. Token store abstraction (`src/oauth/token-store.ts`)**

The `TokenStore` interface is the boundary between OAuth logic and persistence. `FileTokenStore` uses a platform-abstraction layer (`src/oauth/file-store.ts`) to handle differences between Node.js `fs` and Deno/Bun's `Deno.*` / `Bun.*` APIs. Clean separation allows the same OAuth logic to run on all runtimes.

**3. Branded token types**

```ts
export type ApiToken = z.infer<typeof ApiTokenSchema> & { readonly __brand: 'ApiToken' };
export type UserToken = z.infer<typeof UserTokenSchema> & { readonly __brand: 'UserToken' };
```

Two distinct string types TypeScript treats as incompatible. You cannot accidentally pass a user token where an API token is expected. Zod schemas enforce this at runtime too.

**4. Zod validation on all responses**

Every endpoint validates its response against a Zod schema before returning. Catches API shape changes early and provides typed errors.

**5. oauth4webapi for OAuth2 protocol**

Protocol complexity (OIDC discovery, PKCE, token refresh, device polling) is delegated to `oauth4webapi` — a well-audited, spec-compliant library. The SDK wraps it in a clean TypeScript interface.

---

## What Makes It Unique

1. **Dual publish targets (npm + JSR)** — `@fromo/exist-sdk` on npm, same package on JSR. Same codebase, both ecosystems. Few libraries do this.

2. **Runtime validation as a first-class concern** — Most SDKs generate types from OpenAPI and stop. This SDK adds Zod validation on top to catch API mismatches at runtime.

3. **PKCE-only OAuth2** — No plain OAuth2, only PKCE. The SDK deliberately doesn't support the less-secure authorization code flow without PKCE.

4. **Cross-runtime file token store** — The `FileTokenStore` abstracts Node/Deno/Bun filesystem differences behind a unified interface. Rarely done well.

5. **Branded token types with Zod** — The `ApiToken` / `UserToken` branding prevents a whole class of token-mixing bugs at both compile time and runtime.

---

## Tech Stack

| Choice | Rationale |
|--------|-----------|
| TypeScript only | Type safety is the core value proposition |
| Zod for validation | Ergonomic, composable, widely used |
| oauth4webapi | Spec-complete, maintained, avoids reimplementing OAuth2 |
| openapi-typescript | Keep types in sync with API automatically |
| Vitest | Fast, modern, native ESM |
| oxlint + oxfmt | Opinionated linting/formatting, zero config |
| semantic-release | Conventional commits, auto-CHANGELOG, auto-npm-publish |

---

## README Current State

The existing README is functional but sparse:
- Explicitly marks "not yet implemented" for OAuth2 — but OAuth2 IS now implemented
- No mention of Zod runtime validation, branded types, or token store system
- No badges for type checking, lint, or JSR score
- No contributing guide or architecture overview
- "Roadmap" section is vague

---

## Key Takeaways for README

1. **Exist.io is for people who track everything** — sleep, mood, exercise, caffeine, symptoms. It's the anti-duolingo for habits: instead of streaks, you see correlations.

2. **The SDK is for developers who want type-safe, multi-runtime access** — Not just a wrapper. A well-designed library with runtime safety, clean abstractions, and OAuth2 done right.

3. **The "perfectionist" angle** — This SDK is for developers who care about: branded types, Zod validation, PKCE-only OAuth2, cross-runtime token stores. It's not a quick wrapper. It's a crafted tool.

4. **Most impressive features** — The OAuth2 implementation (PKCE, device flow, token stores), the runtime validation layer, and the multi-runtime support are all non-trivial features that most SDKs skip.
