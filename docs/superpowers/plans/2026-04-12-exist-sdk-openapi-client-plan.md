# exist-sdk OpenAPI Client — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A read-only TypeScript SDK for Exist.io with ESM modules, generated from the OpenAPI spec, targeting both Node.js and Deno.

**Architecture:** TypeScript ESM package with a fetch-based runtime-agnostic HTTP client, openapi-typescript-generated types, and pure-function endpoint exports. No class wrappers. Token management is external (caller provides).

**Tech Stack:** TypeScript, openapi-typescript, tsx, vitest, fetch (native in Deno/Node 18+, injectable for older Node)

---

## File Structure

```
exist-sdk/
├── src/
│   ├── client.ts              # Core HTTP client + ExistError
│   ├── types.ts               # Generated from OpenAPI spec (by scripts/generate-types.ts)
│   ├── endpoints/
│   │   ├── auth.ts            # exchangeSimpleToken()
│   │   ├── account.ts         # getProfile()
│   │   └── attributes.ts      # getAttributesWithValues()
│   └── index.ts               # Public API re-exports
├── scripts/
│   └── generate-types.ts      # openapi-typescript codegen script
├── tests/
│   ├── client.test.ts         # Unit tests for client.ts
│   └── endpoints/
│       ├── auth.test.ts
│       ├── account.test.ts
│       └── attributes.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

### Task 1: Set up project scaffold

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "exist-sdk",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types.ts"
  },
  "scripts": {
    "generate-types": "tsx scripts/generate-types.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {},
  "devDependencies": {
    "openapi-typescript": "^1.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src", "scripts", "tests"]
}
```

- [ ] **Step 3: Write vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 4: Install dependencies**

Run: `yarn install`

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts yarn.lock
git commit -m "chore: scaffold project with openapi-typescript, tsx, vitest

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Write generate-types script

**Files:**

- Create: `scripts/generate-types.ts`
- Modify: `package.json` (add generate-types script already included above)

- [ ] **Step 1: Write the failing test**

No test for code generation — this is a build-time script.

- [ ] **Step 2: Write generate-types.ts**

```typescript
import { generateTypes } from "openapi-typescript";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const specPath = resolve(__dirname, "../docs/exist-api-openapi.yaml");
const outputPath = resolve(__dirname, "../src/types.ts");

const types = await generateTypes(specPath, {
  output: outputPath,
});

writeFileSync(outputPath, types);
console.log("Generated src/types.ts");
```

- [ ] **Step 3: Run script to verify it works**

Run: `yarn generate-types`
Expected: `Generated src/types.ts` with content starting with `export interface SimpleTokenResponse`

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-types.ts src/types.ts
git commit -m "feat: add openapi-typescript codegen script

Generates src/types.ts from docs/exist-api-openapi.yaml via tsx.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Implement core HTTP client

**Files:**

- Create: `src/client.ts`
- Create: `tests/client.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { createClient, type ExistClient } from "../src/client";

describe("createClient", () => {
  it("injects Authorization header with Token prefix", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ username: "test" }),
    });

    const client = createClient({ token: "abc123", fetch: mockFetch });
    await client.get("/accounts/profile/");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/accounts/profile/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Token abc123",
        }),
      }),
    );
  });

  it("throws ExistError on non-2xx response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Invalid token" }),
    });

    const client = createClient({ token: "bad", fetch: mockFetch });

    await expect(client.get("/accounts/profile/")).rejects.toMatchObject({
      status: 401,
      message: "Invalid token",
    });
  });

  it("throws ExistError on rate limit (429)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ message: "Rate limited" }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });

    await expect(client.get("/accounts/profile/")).rejects.toMatchObject({
      status: 429,
      message: "Rate limited",
    });
  });

  it("allows custom baseUrl", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    const client = createClient({
      token: "abc",
      baseUrl: "https://custom.example.com/api/2/",
      fetch: mockFetch,
    });
    await client.get("/accounts/profile/");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://custom.example.com/api/2/accounts/profile/",
      expect.any(Object),
    );
  });

  it("serializes request body as JSON", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: "abc123" }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    await client.post("/auth/simple-token/", {
      body: { username: "user", password: "pass" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/auth/simple-token/",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ username: "user", password: "pass" }),
      }),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest run tests/client.test.ts`
Expected: FAIL — `client.ts` does not exist

- [ ] **Step 3: Write minimal client.ts**

```typescript
export interface ExistError {
  status: number;
  message: string;
  code?: string;
  cause?: unknown;
}

export interface ClientOptions {
  token: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface ExistClient {
  get(path: string): Promise<unknown>;
  post(path: string, opts?: { body?: unknown }): Promise<unknown>;
}

export function createClient(opts: ClientOptions): ExistClient {
  const { token, baseUrl = "https://exist.io/api/2/", fetch: fetchImpl = fetch } = opts;

  async function request(path: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${baseUrl.replace(/\/$/, "")}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Token ${token}`,
    };

    const { body, ...rest } = options;
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetchImpl(url, {
      ...rest,
      headers: { ...headers, ...rest.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : response.statusText;

    if (!response.ok) {
      const err: ExistError = {
        status: response.status,
        message,
        cause: data,
      };
      throw err;
    }

    return data;
  }

  return {
    get: (path) => request(path),
    post: (path, { body } = {}) => request(path, { method: "POST", body }),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest run tests/client.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/client.ts tests/client.test.ts
git commit -m "feat: implement core HTTP client with auth header injection and error handling

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Implement auth endpoint

**Files:**

- Create: `src/endpoints/auth.ts`
- Create: `tests/endpoints/auth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { exchangeSimpleToken } from "../../src/endpoints/auth";
import { createClient, type ExistClient } from "../../src/client";

describe("exchangeSimpleToken", () => {
  it("calls POST /auth/simple-token/ with credentials", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: "abc123" }),
    });

    const client = createClient({ token: "unused", fetch: mockFetch });
    const result = await exchangeSimpleToken(client, {
      username: "user@example.com",
      password: "secret",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/auth/simple-token/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "user@example.com",
          password: "secret",
        }),
      }),
    );
    expect(result).toEqual({ token: "abc123" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest run tests/endpoints/auth.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write auth.ts**

```typescript
import type { ExistClient } from "../client";

interface SimpleTokenRequest {
  username: string;
  password: string;
}

export async function exchangeSimpleToken(
  client: ExistClient,
  credentials: SimpleTokenRequest,
): Promise<{ token: string }> {
  return client.post("/auth/simple-token/", { body: credentials }) as Promise<{
    token: string;
  }>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest run tests/endpoints/auth.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/endpoints/auth.ts tests/endpoints/auth.test.ts
git commit -m "feat: add exchangeSimpleToken endpoint

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Implement account endpoint

**Files:**

- Create: `src/endpoints/account.ts`
- Create: `tests/endpoints/account.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { getProfile } from "../../src/endpoints/account";
import { createClient } from "../../src/client";

describe("getProfile", () => {
  it("calls GET /accounts/profile/", async () => {
    const mockProfile = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      timezone: "UTC",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockProfile),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    const result = await getProfile(client);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/accounts/profile/",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockProfile);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest run tests/endpoints/account.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write account.ts**

```typescript
import type { ExistClient } from "../client";
import type { UserProfile } from "../types";

export async function getProfile(client: ExistClient): Promise<UserProfile> {
  return client.get("/accounts/profile/") as Promise<UserProfile>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest run tests/endpoints/account.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/endpoints/account.ts tests/endpoints/account.test.ts
git commit -m "feat: add getProfile endpoint

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Implement attributes endpoint

**Files:**

- Create: `src/endpoints/attributes.ts`
- Create: `tests/endpoints/attributes.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { getAttributesWithValues } from "../../src/endpoints/attributes";
import { createClient } from "../../src/client";

describe("getAttributesWithValues", () => {
  it("calls GET /attributes/with-values/ with default pagination", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ count: 0, results: [] }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    await getAttributesWithValues(client);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/attributes/with-values/",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("passes query params for page, limit, days, attributes filters", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ count: 0, results: [] }),
    });

    const client = createClient({ token: "abc", fetch: mockFetch });
    await getAttributesWithValues(client, {
      page: 2,
      limit: 50,
      days: 7,
      attributes: "mood",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://exist.io/api/2/attributes/with-values/?page=2&limit=50&days=7&attributes=mood",
      expect.any(Object),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest run tests/endpoints/attributes.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write attributes.ts**

```typescript
import type { ExistClient } from "../client";
import type { PagedAttributesWithValues } from "../types";

interface GetAttributesParams {
  page?: number;
  limit?: number;
  days?: number;
  groups?: string;
  date_max?: string;
  attributes?: string;
}

function buildQuery(params: GetAttributesParams): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export async function getAttributesWithValues(
  client: ExistClient,
  params: GetAttributesParams = {},
): Promise<PagedAttributesWithValues> {
  const qs = buildQuery(params);
  return client.get(`/attributes/with-values/${qs}`) as Promise<PagedAttributesWithValues>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest run tests/endpoints/attributes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/endpoints/attributes.ts tests/endpoints/attributes.test.ts
git commit -m "feat: add getAttributesWithValues endpoint

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Write public exports

**Files:**

- Create: `src/index.ts`

- [ ] **Step 1: Write src/index.ts**

```typescript
export { createClient } from "./client";
export type { ExistClient, ClientOptions, ExistError } from "./client";
export type { UserProfile, AttributeWithValues, PagedAttributesWithValues } from "./types";
export { getProfile } from "./endpoints/account";
export { getAttributesWithValues } from "./endpoints/attributes";
export { exchangeSimpleToken } from "./endpoints/auth";
```

- [ ] **Step 2: Run typecheck to verify exports**

Run: `yarn typecheck`
Expected: PASS with no errors (types are generated and imported)

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: expose public API via src/index.ts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Write endpoint unit tests

Already covered by Tasks 4, 5, 6 (each endpoint has its own test file).
Skip — tests written inline with implementation tasks.

---

### Task 9: Run typecheck and tests

- [ ] **Step 1: Run full typecheck**

Run: `yarn typecheck`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `yarn test:run`
Expected: PASS (all tests across client.test.ts and endpoint test files)

---

### Task 10: Commit all changes

- [ ] **Step 1: Verify git status**

Run: `git status`
Expected: clean working tree (all changes committed)

- [ ] **Step 2: Verify last commit is the test run**

If all prior commits were done per-task, the working tree should be clean.
If not, amend or add a final commit capturing any remaining changes.

---

## Spec Coverage Check

| Spec Section                      | Task      |
| --------------------------------- | --------- |
| ESM module structure              | Task 1    |
| openapi-typescript generation     | Task 2    |
| Runtime-agnostic fetch client     | Task 3    |
| Auth endpoint (simple token)      | Task 4    |
| Account endpoint (profile)        | Task 5    |
| Attributes endpoint (with values) | Task 6    |
| Public exports                    | Task 7    |
| Unit tests                        | Tasks 3-7 |
| TypeScript + vitest setup         | Task 1    |

All spec sections covered. No gaps.

## Type Consistency Check

- `createClient` returns `ExistClient` with `get()` and `post()` — used consistently in all endpoint files
- `getProfile` returns `UserProfile` (from types.ts) — consistent
- `getAttributesWithValues` returns `PagedAttributesWithValues` — consistent
- `exchangeSimpleToken` returns `{ token: string }` — inline type, consistent
- `ExistError` fields: `status`, `message`, `code?`, `cause?` — all endpoint tests match

All type references are consistent across tasks.
