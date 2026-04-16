# GRFP Stage 4: Brain Jam — README Angle Synthesis

## Dual-AI Collaboration Notes

**Claude's initial proposal** (Stage 3 Think Tank findings):
- Tagline: "The type-safe SDK for the quantified self"
- Structure: tagline → badges → per-runtime install → quick start → 3-layer value prop → feature grid → usage → contributing
- Lead differentiators: PKCE-only, Zod runtime validation, multi-runtime
- Tone: Precise, confident, no fluff

**Gemini brainstorming** (attempted via gemini-brainstorm): Tool returned minimal output. Synthesizing from research patterns instead.

---

## Angle Decision

### Tagline: **"The type-safe SDK for the quantified self"**

**Why this one**:
- "Type-safe SDK" is immediately scannable — TypeScript developers know exactly what this means
- "Quantified self" signals the domain — it's not just any API wrapper, it's for a specific use case
- It's confident without being hyperbolic
- Alternatives considered:
  - B) "Track everything. Build anything." — too generic
  - C) "Your exist.io data, fully typed, always validated" — too long, buries the "SDK" signal
  - D) "The SDK that respects your data" — good sentiment, but "respects" sounds defensive

**Gemini would likely add**: The tagline should appear with a badge row immediately below it, so the visitor sees "what it is" + "where to get it" in one glance.

---

## Structure Decision

### Final README Structure

```
# exist-sdk
[Tagline + Badge Row]

## Installation
[Per-runtime table: npm | JSR | Bun]

## Quick Start
[5-7 lines: exchange token → create client → first API call]

## Why exist-sdk?
[The 3-layer value prop — but keep it tight, 2-3 sentences max]

## Features
[6-bullet feature grid with brief descriptions]

## Authentication
[Simple token | OAuth2 — split into two clear sub-sections]
[OAuth2 sub-section explains PKCE by default, with [!WARNING] box]

## Usage
[By concern, not by endpoint: Profile | Attributes | Averages | Correlations | Writes]

## Error Handling
[ExistError type, with example]

## Advanced
[Custom fetch | Multiple clients | Token store customization]

## Contributing
[Points to CONTRIBUTING.md]

[License]
```

### What changed from proposal:
- Moved "Why exist-sdk?" *before* Features — it's the "why should I care" hook before the feature list
- Combined "Authentication" into one section with sub-sections rather than scattering auth info
- "Error Handling" is its own section — it's important for SDKs and often buried
- "Advanced" at the end for power users — doesn't clutter the main path

---

## Key Creative Decisions

### 1. The Hook: "Why not just use fetch()?"

**Decision**: Address it head-on in the "Why exist-sdk?" section, in one sentence:

> "You could write `fetch()` calls to the exist.io API. You could also manage token auth, response parsing, and error handling yourself. Or you could use a library that does all of that — with type safety, runtime validation, and PKCE-only OAuth2 built in."

This is better than a full comparison table (we have no direct competitors) because it's a statement, not a chart.

### 2. PKCE as Identity, Not a Feature

**Decision**: The README should make PKCE the *first* OAuth2 thing mentioned, with a [!WARNING] box:

```markdown
> [!WARNING]
> This SDK only supports OAuth2 with PKCE. 
> Authorization code flows without PKCE are not supported.
> This is intentional — PKCE protects your users' data even if
> your client's credentials are exposed.
```

This signals security-first values immediately. It preempts "why can't I use basic OAuth2?" questions.

### 3. Per-Runtime Table Upfront

**Decision**: Right after badges, a simple table:

| Runtime | Install |
|---------|---------|
| Node.js | `npm install @fromo/exist-sdk` |
| Deno / Bun | `import from 'jsr:@fromo/exist-sdk'` |

No confusion about which package to use for which runtime.

### 4. Quick Start Is 5 Lines, No Setup

**Decision**:

```ts
import {createClient, exchangeSimpleToken, getProfile} from '@fromo/exist-sdk';

const {token} = await exchangeSimpleToken({username: '...', password: '...'});
const client = createClient({token});

const profile = await getProfile(client);
console.log(profile.username);
```

Five lines. Token exchange → client → API call. Done.

### 5. No "Status: Alpha" Apology

**Decision**: Don't mention alpha. The code quality (oauth4webapi, Zod schemas, branded types, semantic-release pipeline) speaks for itself. If someone looks at the package.json version (1.0.0), they can decide for themselves.

---

## Tone Guide

| Do | Don't |
|----|-------|
| Precise, factual | Marketing-hyped |
| Show the code | Explain the obvious |
| Trust the reader | Talk down to the reader |
| Lead with differentiators | Bury the impressive stuff |
| Use [!WARNING] for real gotchas | Use boxes for fluff |
| Clean, typographic | Emoji in headings |

---

## The One-Line README Test

Can you describe what this README does in one line of copy?

> **"A TypeScript SDK for exist.io — with runtime Zod validation, PKCE-only OAuth2, and multi-runtime support."**

Everything in the README should reinforce this sentence.

---

## Key Takeaways for Pen Wielding

1. **Tagline locked**: "The type-safe SDK for the quantified self"
2. **Structure locked**: tagline → badges → install table → quick start → why → features → auth → usage → errors → advanced → contributing
3. **PKCE[!WARNING] box** is the most important callout — it signals values
4. **Quick start is 5 lines** — in media res, no setup fluff
5. **No alpha disclaimer** — confidence, not apology
6. **Feature grid = 6 bullets** — PKCE, Zod, multi-runtime, branded tokens, full coverage, auto-types
7. **"Why not just use fetch()?"** — addressed in one sentence in the Why section
