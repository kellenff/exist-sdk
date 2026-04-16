# GRFP Stage 3: Think Tank — Researching Exemplar READMEs

## Researched READMEs

### Octokit.js — "The all-batteries-included GitHub SDK"

**Tagline**: *"The all-batteries-included GitHub SDK for Browsers, Node.js, and Deno."*

**Structure**:
1. Tagline + brief description
2. Table of contents (auto-generated)
3. Features grid (6 bullets: Complete, Prescriptive, Universal, Tested, Typed, Decomposable, Extendable)
4. Usage section with per-runtime installation (Browser, Deno, Node in a table)
5. Constructor options
6. Authentication section
7. REST API, GraphQL, App client, Webhooks, OAuth sections

**What works**:
- Per-runtime usage table at the top — instantly answers "how do I install for Deno vs Node?"
- Features as a crisp bullet grid — fast scanning
- Warning/tip boxes (`[!IMPORTANT]`, `[!WARNING]`) for gotchas — surfaces important info without burying it
- Authentication is its own major section — it's prominent, not hidden

**What to steal**:
- Runtime-specific installation table
- Features as a 6-bullet grid
- `<!-- omit in toc -->` comment trick for selective TOC inclusion

---

### Stripe Node Library — "The Stripe Node.js Library"

**Tagline**: None — leads with what it does directly

**Structure**:
1. Badges (version, build, downloads)
2. Tip box (Discord community)
3. One-liner description
4. Link to full docs
5. Requirements section (explicit: Node 18+)
6. Installation
7. Usage code example
8. TypeScript section (separate, detailed)
9. Expand patterns section
10. Error handling section

**What works**:
- `Requirements` section is explicit — no guessing
- Tip and Warning boxes surface important info contextually
- Separates "basic usage" from "TypeScript-specific" concerns cleanly
- The `[!WARNING]` box about lazy instantiation is a great pattern — shows real engineering empathy

**What to steal**:
- Explicit requirements section
- Warning boxes for important gotchas
- Separate TypeScript section for TS-specific patterns

---

### Hono — "The edge Framework"

**Tagline**: *"Ultrafast web framework for the Edges"*

**Structure**:
1. Visual logo
2. Benchmarks (context: it's a performance-focused framework)
3. Features row (3-4 items)
4. Who it's for section
5. Quick start code
6. Detail sections

**What works**:
- Benchmarks for credibility (when relevant)
- "Who it's for" — audience clarity
- Minimal TOC, quick start comes fast
- Clean, typographic visual style

**What to steal**:
- "Who it's for" section — sharp audience definition
- Benchmarks if relevant (exist-sdk is fast too — pure functions, no overhead)

---

### openapi-typescript — Same ecosystem, adjacent project

**Structure**:
1. Project description
2. Package cards (two packages with visual logos)
3. Sponsors section
4. Contributing guides

**What works**:
- Package cards show multi-package architecture cleanly
- Sponsor acknowledgment is prominent — community goodwill
- Contributing guides are linked, not inline

**What to steal**:
- If we add sub-packages (exist-sdk + exist-hooks, etc.), use the package card layout
- Link to contributing guide rather than duplicating it

---

### Zod (from knowledge)

**Tagline**: *"TypeScript-first schema validation with compile-time and runtime type inference"*

**Structure**:
1. Tagline + core problem solved
2. Comparison table (vs alternatives: joi, io-ts, ajv)
3. Features list
4. Installation
5. Quick start
6. Deep-dive sections by feature

**What works**:
- Comparison table immediately differentiates from alternatives
- Features are a scan-friendly list with brief descriptions
- Code examples are real (not toy examples)

**What to steal**:
- Comparison table — if exist-sdk has clear advantages over "just use fetch", show it
- Feature bullets with brief descriptions, not just names

---

## Cross-Cutting Patterns

### The Anatomy of a Great SDK README

```
1. TAGLINE (one line, evocative)
2. BADGES (version, npm, build, type definitions)
3. ONE-LINER (what it does, no fluff)
4. FEATURE GRID (3-6 bullets, scannable)
5. QUICK START (3-7 lines, in media res)
6. INSTALLATION (per-runtime if applicable)
7. USAGE EXAMPLES (by concern, not by endpoint)
8. DEEP SECTIONS (auth, error handling, advanced)
9. CONTRIBUTING / LICENSE
```

### The Per-Runtime Table Pattern

Octokit handles multi-runtime by showing all three in one table:

```markdown
| Environment | Import from |
|-------------|-------------|
| Browser     | esm.sh      |
| Deno        | esm.sh      |
| Node        | npm         |
```

exist-sdk should do the same: npm / JSR / Bun in a table.

### Warning/Tip Boxes

```markdown
> [!WARNING]
> Important gotcha here

> [!TIP]
> Pro tip for power users

> [!IMPORTANT]
> Requirement or prerequisite
```

These are GitHub-native markdown — no plugins needed.

### Features Grid

```markdown
- **Complete** — Full API coverage
- **Type-safe** — TypeScript-first with runtime validation
- **Multi-runtime** — Node.js, Deno, Bun
- **Secure by default** — PKCE-only OAuth2
```

Short. Scannable. Each item is a complete thought.

---

## What These Tell Us About exist-sdk's README

### Should have

1. **Tagline**: "The type-safe SDK for the quantified self" — or similar
2. **Badges**: npm, JSR, build status, typecheck, lint
3. **Per-runtime installation table**: npm + JSR in a table
4. **Feature grid**: 5-6 bullets (OAuth2, Zod validation, multi-runtime, branded types, auto-generated types)
5. **Quick start**: 5 lines — token exchange, client creation, first API call
6. **Usage sections by concern**: Auth, reading data, writing data, error handling
7. **Warning boxes**: For important gotchas (lazy token store, PKCE requirements)
8. **Contributing section**: Points to CONTRIBUTING.md

### Should NOT have

1. **Vague roadmap** — either remove or make specific
2. **"Status: Alpha" disclaimer** — the code quality speaks for itself; don't apologize
3. **Comparison table vs alternatives** — unless we can find real alternatives to compare against (exist.io has no official SDK, so "vs raw fetch" is the comparison)
4. **Lengthy architecture explanation** — save that for CLAUDE.md
5. **Emoji in badges or section headers** — keep it clean and typographic

### Potential Headline Variations

| Option | Tagline |
|--------|---------|
| 1 | "The type-safe SDK for the quantified self" |
| 2 | "Track everything. Build anything. With type safety." |
| 3 | "Your exist.io data, fully typed, always validated" |
| 4 | "The SDK that respects your data — and your users' security" |

---

## Key Takeaways for Brain Jam

1. **The per-runtime installation table is non-negotiable** — it's the clearest way to show npm + JSR support
2. **Warning boxes for the PKCE story** — "This SDK only supports PKCE OAuth2. No exceptions. This is intentional."
3. **Feature grid should lead with differentiators** — not "type-safe" (everyone claims that) but "runtime-validated" and "PKCE-only"
4. **Quick start should be 5-7 lines max** — token, client, one API call
5. **Don't apologize for alpha** — the quality of the code (oauth4webapi, Zod, branded types) speaks for itself
6. **Consider a "Why not just use fetch?" section** — addresses the obvious question head-on
