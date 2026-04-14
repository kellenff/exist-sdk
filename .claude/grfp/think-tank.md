# exist-sdk Think Tank

## Exemplar SDK READMEs

### Stripe Node.js SDK (`stripe/stripe-node`)
- **What it does well:**
  - Hero: big bold "The official Stripe API client" + npm badge + version
  - One-liner pitch immediately
  - **Installation** section — npm + yarn + PNPM
  - **Usage** — minimal, real working code, shows API key + first call
  - ** Documentation** link prominent
  - **Testing** section for contributors
  - Auto-generated from openapi — types in sync

- **What they avoid:** No fluff, no "we're excited to announce", no changelog dump

### Octokit (`octokit/octokit.js`)
- **What it does well:**
  - Table of contents for fast navigation
  - Code example within first 5 lines
  - Authentication first — show how to get a token before showing usage
  - Pagination built-in, shown in README
  - Links to official docs for deeper reference

### Supabase JS (`supabase/supabase-js`)
- **What it does well:**
  - Screenshotted demo on hero — immediate visual context
  - Multiple full code examples covering different use cases
  - Typed errors shown
  - Clear install for multiple environments (npm, yarn, bun)
  - Link to official docs for every endpoint detail

### Fauna JS (`fauna/fauna-js`)
- **What it does well:**
  - Code example right at top
  - Clear auth setup
  - Links to concepts, guides, API reference

### AWS SDK for JavaScript (`aws/aws-sdk-js`)
- **What it does well:**
  - Terse, utilitarian
  - Multiple service examples
  - Clear contribution guidelines

---

## Common Patterns

### Structure (all exemplars follow this order)
1. **Badge bar** — npm version, build status, license
2. **One-line pitch** — what it IS (not a description)
3. **Installation** — npm/yarn/pnpm one-liners
4. **Quick Start** — complete working code, auth + first call
5. **Detailed Examples** — common operations
6. **Authentication** — explicit section, how to get credentials
7. **TypeScript-specific** — type exports shown, generics referenced
8. **Error handling** — typed errors shown
9. **Link to full docs** — README is a teaser, not the docs
10. **Contributing** — small, links to separate CONTRIBUTING.md

### What ALL avoid
- Screenshots of the product UI (README is about code, not UI)
- History/changelog dumps in README (separate CHANGELOG.md)
- "We hope you love it" pleasantries
- Large blocks of explanatory prose — code speaks
- Incomplete examples that don't run
- Showing every single method — just the common ones

### Code example rules
- Use real, working code (no pseudocode)
- Show auth setup before usage
- Show one complete operation, not a soup of all features
- Typed error handling shown when available

---

## Application to exist-sdk README

### Current README problems (from deep-dive)
1. `client.attributes.list()` — method doesn't exist
2. `new ExistClient()` — should be `createClient(opts)`
3. No authentication section — how to get a token?
4. Alpha warning buried after installation
5. No error handling example
6. No contribution/contributing section

### What the README should borrow

From Stripe:
- Badge bar (npm, JSR, license)
- Working code at top showing full auth + one API call
- TypeScript types shown explicitly (`import type {UserProfile}`)

From Octokit:
- Table of contents for nav
- Auth-first — show `exchangeSimpleToken()` or token setup before anything

From Supabase:
- Multiple examples (profile, attributes, write operation)
- Typed errors shown (`ExistError`)

### Minimum viable README structure
```
1. Badge bar
2. One-liner pitch
3. Installation (npm + JSR)
4. Quick Start — full working code with token exchange
5. Examples — profile + attributes + write op
6. Authentication — explain how to get token
7. API Reference link
8. Contributing link
```

### What to NOT include
- Don't show non-existent API methods
- Don't show class syntax for factory function
- Don't bury alpha warning — own it at top
- Don't list every endpoint — just the working ones