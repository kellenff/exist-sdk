Applying caveman compression manually to the provided text, preserving all structure, URLs, code blocks, and technical content:

# exist-sdk Crystal Ball

## Vision

TypeScript-first Exist.io SDK covers FULL API surface — read + write. Alpha. Potential: go-to library for Exist integration in TypeScript ecosystem.

---

## What It Could Become

### Full API Coverage

Types.ts shows entire API. Currently implemented:

| Endpoint | Status |
|----------|--------|
| `GET /accounts/profile/` | ✅ `getProfile()` |
| `GET /attributes/with-values/` | ✅ `getAttributesWithValues()` |
| `POST /auth/simple-token/` | ✅ `exchangeSimpleToken()` |
| `GET /attributes/averages/` | ❌ untapped |
| `GET /attributes/correlations/` | ❌ untapped |
| `GET /attributes/correlations/combo/` | ❌ untapped |
| `POST /attributes/acquire/` | ❌ untapped |
| `POST /attributes/release/` | ❌ untapped |
| `POST /attributes/create/` | ❌ untapped |
| `POST /attributes/update/` | ❌ untapped |
| `POST /attributes/increment/` | ❌ untapped |
| `GET /oauth2/authorize/` | ❌ untapped |
| `POST /oauth2/access_token/` | ❌ untapped |

Write operations (increment, update, create) are the real differentiator. Anyone can `fetch` a GET endpoint. Composable write operations = SDK value.

---

## Ecosystem Fit

Exist.io has NO official TypeScript SDK. GitHub shows community wrappers (Python, Ruby) — no serious TypeScript competition.

Target use cases:

- **Habit tracking integrations** — push data to Exist from other apps (IFTTT, Zapier alternatives, custom sensors)
- **Personal dashboards** — pull Exist data into static sites, Obsidian plugins, etc.
- **Research tools** — academic self-tracking, quantified self projects
- **Bot/widget developers** — update attributes programmatically (steps from Strava, sleep from Oura, mood from Daylio)

---

## Audience Segments

1. **Personal automators** — IFTTT/Zapier users who want to log custom data to Exist
2. **Quantified-self researchers** — pulling correlations for personal analysis
3. **App developers** — embedding Exist tracking into niche tools (mood journals, habit coaches)
4. **Daylio/Oura/Strava power users** — piping data from other tracking apps into Exist's correlation engine

---

## Strategic Angle

Exist.io's killer feature = **correlation engine**. SDK should emphasize this.

Angle: "Exist tracks everything. This SDK connects everything to Exist."

Competing on: DX (TypeScript types, fetch injection, tree-shakable) over raw API.

---

## Roadmap Potential

### Phase 1 (now) — thin wrapper
- Full read coverage (profile, attributes, averages, correlations)
- Simple token auth

### Phase 2 (near) — write operations
- Attribute create/update/increment/acquire/release
- Full type-safe request bodies

### Phase 3 (later) — OAuth2
- Full OAuth2 flow support
- Token refresh handling

### Phase 4 (eventual) — ecosystem
- React Query / SWR hooks
- Next.js examples
- Integration templates (Exist + Strava, Exist + Oura, Exist + Daylio)

---

## Positioning

**Current README problem:** Shows `client.attributes.list()` which doesn't exist. Alpha warning buried. No emphasis on what makes Exist special.

**Crystal ball README should:**

- Lead with Exist's correlation engine, not generic "tracks habits"
- Show real, working code (use `getAttributesWithValues(client)`, not fictional API)
- Show write operations — those are the compelling differentiator
- Emphasize dual npm + JSR publish (Deno/Bun users matter)
- Call out what is/isn't implemented (honest about alpha)

---

## Key Insight

README code example has a bug — uses `new ExistClient` (class syntax) when actual API is `createClient(opts)` (factory). This is the first thing any developer will copy-paste and run. It will fail. Fix this first.