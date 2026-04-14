import type {components} from '../types.js';
import type {TokenStore} from './token-store.js';

type OAuthAccessTokenResponse = components['schemas']['OAuthAccessTokenResponse'];

interface FileStoreOptions {
  filePath: string;
}

interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * File-based implementation of TokenStore.
 * Cross-runtime: works in Node.js, Deno, and Bun.
 * File permissions set to 0600 for security.
 */
export class FileTokenStore implements TokenStore {
  private filePath: string;

  constructor(options: FileStoreOptions) {
    this.filePath = options.filePath;
  }

  getAccessToken(): string | null {
    const data = this.#readFile();
    return data?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    const data = this.#readFile();
    return data?.refreshToken ?? null;
  }

  setTokens(tokens: OAuthAccessTokenResponse): void {
    const data: TokenData = {
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? null,
    };
    this.#writeFile(data);
  }

  clear(): void {
    this.#removeFile();
  }

  #readFile(): TokenData | null {
    try {
      const text = this.#readTextFile(this.filePath);
      return JSON.parse(text) as TokenData;
    } catch {
      return null;
    }
  }

  #writeFile(data: TokenData): void {
    const text = JSON.stringify(data);
    this.#writeTextFile(this.filePath, text);
    this.#chmod(this.filePath, 0o600);
  }

  #removeFile(): void {
    try {
      this.#unlink(this.filePath);
    } catch {
      // File doesn't exist, nothing to clear
    }
  }

  // Cross-runtime abstraction layer
  #readTextFile(path: string): string {
    // @ts-ignore - Deno global
    if (typeof Deno !== 'undefined' && Deno.readTextFileSync) {
      // @ts-ignore
      return Deno.readTextFileSync(path);
    }
    // Node.js / Bun
    const {readFileSync} = require('fs') as {
      readFileSync: (p: string, enc: string) => string;
    };
    return readFileSync(path, 'utf-8');
  }

  #writeTextFile(path: string, text: string): void {
    // @ts-ignore - Deno global
    if (typeof Deno !== 'undefined' && Deno.writeTextFileSync) {
      // @ts-ignore
      Deno.writeTextFileSync(path, text);
      return;
    }
    // Node.js / Bun
    const {writeFileSync} = require('fs') as {
      writeFileSync: (p: string, data: string) => void;
    };
    writeFileSync(path, text);
  }

  #chmod(path: string, mode: number): void {
    // @ts-ignore - Deno global
    if (typeof Deno !== 'undefined' && Deno.chmodSync) {
      // @ts-ignore
      Deno.chmodSync(path, mode);
      return;
    }
    // Node.js
    const {chmodSync} = require('fs') as {
      chmodSync: (p: string, m: number) => void;
    };
    chmodSync(path, mode);
  }

  #unlink(path: string): void {
    // @ts-ignore - Deno global
    if (typeof Deno !== 'undefined' && Deno.removeSync) {
      // @ts-ignore
      Deno.removeSync(path);
      return;
    }
    // Node.js / Bun
    const {unlinkSync} = require('fs') as {
      unlinkSync: (p: string) => void;
    };
    unlinkSync(path);
  }
}
