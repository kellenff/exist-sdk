# Exist SDK

A TypeScript SDK for building apps and scripts on top of [Exist](https://exist.io/) using its HTTP API.

## Status

**Alpha** — usable for development and testing. The API surface is unstable and may change.

## Installation

**npm:**

```sh
npm install @fromo/exist-sdk
```

**JSR (Deno, Bun):**

```ts
import { ... } from "jsr:@fromo/exist-sdk";
```

## Usage

```ts
import { ExistClient } from "@fromo/exist-sdk";

const client = new ExistClient({
  token: process.env.EXIST_TOKEN!,
});

const { data } = await client.attributes.list();
```

## Requirements

- Node.js 18+ (for fetch-based APIs)
- An [Exist](https://exist.io/) account and API token

## API Reference

- [Exist developer docs](https://developer.exist.io/reference/important_values/)

## Development

```sh
# Install dependencies
yarn install

# Lint
yarn lint

# Type check
yarn typecheck

# Run tests
yarn test
```

## Publishing

Releases are automated via Semantic Release. On every merge to `main` with a conventional commit (`feat:`, `fix:`, etc.), the package is published to both npm and JSR.

| Registry                                              | Package            | dist-tags        |
| ----------------------------------------------------- | ------------------ | ---------------- |
| [npm](https://www.npmjs.com/package/@fromo/exist-sdk) | `@fromo/exist-sdk` | `latest`, `next` |
| [JSR](https://jsr.io/@fromo/exist-sdk)                | `@fromo/exist-sdk` | —                |

Pre-releases (`alpha`, `beta`, `next`) are published to the `next` channel on npm.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
