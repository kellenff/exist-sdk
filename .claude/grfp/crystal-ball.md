# GRFP Stage 2: Crystal Ball — What the README Could Be

## Vision: The README's Central Story

**The exist-sdk README should tell a story about the quantified self — not just "here's an API wrapper."**

The existential question: why would a developer choose exist-sdk over just writing `fetch` calls to the exist.io API? The answer is not "type safety" (plenty of libraries offer that). The answer is deeper:

> **exist.io is where you send all your life's data. exist-sdk is where you take it back out — with elegance, safety, and the full power of your habits at your fingertips.**

This reframes the SDK as a **personal informatics enabler**, not just a type-safe fetch wrapper. The audience isn't just "TypeScript developers" — it's developers who care about *their data* and *their habits*.

---

## Positioning Angle

### The Three-Layer Value Proposition

```
┌─────────────────────────────────────────────┐
│  Why exist-sdk?                             │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: Convenience                       │
│  "I don't want to manage auth or parse      │
│   response shapes manually"                 │
│                                             │
│  Layer 2: Safety                            │
│  "I want my types verified at runtime,      │
│   not just compile time"                    │
│                                             │
│  Layer 3: Philosophy                        │
│  "I care about my data. I want a library    │
│   that respects that."                      │
│                                             │
└─────────────────────────────────────────────┘
```

Most SDKs live at Layer 1. The best ones reach Layer 2. This SDK can genuinely claim Layer 3 — because the features (PKCE-only OAuth2, branded token types, Zod validation, cross-runtime support) all signal "we thought about the hard cases so you don't have to."

---

## Audience Segments

| Segment | Motivation | README Pitch |
|---------|-----------|--------------|
| **QS hobbyists** | "I track my sleep/mood/exercise and want to build custom views" | "Your exist.io data, in your terminal, in your dashboard, in your scripts" |
| **App developers** | Building a habit-tracking or wellness app | "Full OAuth2 support — PKCE only, because your users' data deserves it" |
| **CLI tool authors** | Quick scripts that need token auth | "Two-line setup, token is stored, done" |
| **Researchers** | Studying behavior patterns, exporting data | "Auto-generated types from the OpenAPI spec — always in sync" |
| **Enterprise/DIY** | Building internal dashboards | "Cross-runtime: Node.js server, Deno deploy, Bun edge functions" |

---

## The README Could Own These Themes

### Theme 1: "Your data, your tools"

The README should feel like it respects the user's intelligence. No filler. No "powered by cutting-edge technology" marketing speak. Just clear, precise documentation that says:

- Here is the problem
- Here is the solution
- Here is the evidence it works

### Theme 2: "Security isn't optional"

The PKCE-only OAuth2 is a genuine differentiator. Most SDKs either skip OAuth2 or implement it poorly. The README should explain *why* PKCE matters:

> **"Every OAuth2 flow in this SDK uses PKCE. No exceptions. Because 'works with OAuth2' and 'secure OAuth2' are different things."**

This is a statement of values, not just a feature.

### Theme 3: "Multi-runtime by design, not by accident"

Most SDKs say "works in Node.js" and hope Deno/Bun compatibility happens. This SDK's `FileTokenStore` abstraction is explicit architecture. The README could show:

```ts
// Same codebase, three runtimes
import {createClient} from '@fromo/exist-sdk';           // npm / Node.js
import {createClient} from 'jsr:@fromo/exist-sdk';      // JSR / Deno
import {createClient} from 'bun:@fromo/exist-sdk';      // Bun (when published)
```

### Theme 4: "Type-safe doesn't end at compile time"

Zod validation catches API shape mismatches at runtime. When exist.io changes a response field, most SDKs fail silently or throw cryptic errors. This SDK throws a `ExistError` with context:

```ts
// Most SDKs: data.whatever — crashes if API changed
// exist-sdk: validates against Zod schema — tells you exactly what broke
const profile = await getProfile(client);
// if the API shape changed, you get: { status: 0, message: "Invalid UserProfile response", cause: [...] }
```

---

## Possible README Structure (Vision)

```
# exist-sdk

## Tagline (short, evocative)
"The type-safe SDK for the quantified self"

## Quick start (3-5 lines, in media res — no setup fluff)

## Why exist-sdk? (the 3-layer value prop)

## Core concepts
- Authentication (token vs OAuth2, PKCE by default)
- Client pattern (pure functions, not classes)
- Runtime validation (Zod on every response)
- Token stores (Memory, File, cross-runtime)

## Features (visual — badges or table)
- Full API coverage
- OAuth2 (authorization code + device flow)
- Cross-runtime (Node, Deno, Bun)
- Runtime validation (Zod)
- Auto-generated types

## Usage examples (code, annotated)
- Quick start
- User profile
- Attribute values
- OAuth2 (authorization code)
- OAuth2 (device code)
- Error handling

## Advanced (for power users)
- Custom fetch
- Token store customization
- Multiple clients

## Contributing

## License
```

---

## What Could This Become?

### Near-term roadmap (already in CLAUDE.md)
- React Query / SWR hooks (mentioned in current README)
- A CLI tool for data export

### Mid-term possibilities
- A `exist-query` sub-package with pre-built aggregations (weekly summaries, rolling averages)
- A `exist-webhooks` helper for handling exist.io webhook payloads
- Integration examples: Grafana dashboard, Notion sync, Home Assistant

### Long-term ecosystem
- This SDK could become the foundation for a community of tools around exist.io
- Think: `exist-cli`, `exist-grafana-datasource`, `exist-notion-sync`
- If the SDK is excellent, people will build on it

---

## Creative Direction

### Tone
Precise. No marketing fluff. The kind of README that a senior engineer reads and thinks "these people know what they're doing."

### Visual language
Consider a small ASCII diagram or icon showing the data flow: your life → exist.io → exist-sdk → your tools. Not a complex architecture diagram — just a simple visual anchor.

### What NOT to do
- Don't lead with "built with TypeScript" — everyone claims that
- Don't use "lightweight" or "minimal" — this is a full-featured SDK, not a micro-lib
- Don't bury the OAuth2 story — it's one of the most impressive parts
- Don't apologize for being alpha — show confidence in the quality

---

## Key Takeaways for README

1. **Tagline**: "The type-safe SDK for the quantified self" — captures both the technical DNA and the philosophy
2. **Lead with why**: Not "what it does" but "why you'd want it"
3. **Show the OAuth2 story**: PKCE-only is a genuine differentiator worth explaining
4. **Show the multi-runtime story**: npm + JSR in the same breath
5. **Respect the reader**: No fluff. Just good documentation that earns trust.
6. **The README is a product**: It should signal "this is a well-maintained, thoughtfully-designed library" before anyone reads a single line of code.
