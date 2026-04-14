`★ Insight ─────────────────────────────────────`
Caveman compression strips articles, filler, hedging, and pleasantries — keeps technical terms, code blocks, URLs, and structure intact. The goal is raw signal, minimal noise.
`─────────────────────────────────────────────────`

# exist-sdk Brain Jam

## Stage 4 Synthesis

Note: Gemini brainstorm timed out. Synthesis from Claude's analysis only.

---

## Angle Decision

### Hook
**"Exist tracks your life. This SDK pipes it anywhere."**

Alternative considered: "Exist's correlation engine finds patterns in your habits" — too abstract for README opener.

### Positioning
TypeScript SDK for exist.io — personal analytics platform, best correlation engine in self-tracking space. No official TypeScript SDK exists. This is the one.

### Tone
Honest-alpha: call out what works, what doesn't, what's planned. Technical but not sterile. Developer-first.

---

## Structure Decision

```
1. Badge bar (npm, JSR, npm version, license, build)
2. One-liner pitch (hook + what it is)
3. Status banner (alpha — what's implemented / what's not)
4. Installation (npm + JSR, one-liner each)
5. Quick Start (complete working code: token exchange → profile fetch)
6. Examples
   a. Get user profile
   b. Fetch attribute values with filters
   c. Update an attribute (write op — the differentiator)
7. Authentication (how to get token, simple token vs OAuth2)
8. Error Handling (ExistError type)
9. API Reference (link to full docs)
10. Contributing (link to CONTRIBUTING.md)
11. Roadmap (what's coming — honest about alpha)
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hook placement | After badges, before install | Hook earns attention before install noise |
| Alpha handling | Dedicated section after pitch | Own it, don't bury it |
| Code example | Token exchange first | Auth is the first thing devs need; demonstrates real API |
| Write example | Include `updateAttributes` or `increment` when implemented | Show the SDK value — GET wrappers alone don't justify a library |
| Badge bar | Minimal: npm, JSR, license | Not 10 badges — clean |
| Contributing | Brief, link to CONTRIBUTING.md | README is teaser, not handbook |

---

## README Angle Summary

**What makes this README stand out:**

1. **Alpha-owns-it** — instead of hiding stability status, front-page it with clear scope statement
2. **Working code that actually works** — the current README has `new ExistClient()` which doesn't exist; new README uses `createClient()` which does
3. **Write operation example** — showing attribute updates proves SDK value beyond "just a fetch wrapper"
4. **Auth-first** — show token exchange before listing features; devs need auth before anything else
5. **Honest roadmap** — tells readers what's coming so they know the SDK is growing

---

## Recommended README Title

`exist-sdk` (not "Exist.io TypeScript SDK") — the package name is the brand.

Subtitle: "TypeScript SDK for exist.io — track everything, connect everywhere."

---

## Next: Pen Wielding

Stage 5 will write the actual README following this structure. Before that:

- Verify which write operations are implemented (if any new endpoints added since deep-dive)
- Check if `updateAttributes` or `increment` wrappers exist in endpoints/