#!/usr/bin/env node
/**
 * Wrapper script to run Playwright tests without Vitest interference
 * This prevents Vitest globals from conflicting with Playwright's expect
 */

// Clear any Vitest globals before loading Playwright
if (typeof globalThis.expect !== 'undefined' && globalThis.expect.constructor?.name === 'VitestExpect') {
  delete globalThis.expect;
}

// Remove Vitest symbols if present
if (typeof Symbol !== 'undefined') {
  const vitestSymbol = Symbol.for('$$jest-matchers-object');
  if (globalThis[vitestSymbol]) {
    delete globalThis[vitestSymbol];
  }
}

// Now run Playwright using pnpm exec to use the correct binary
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const child = spawn('pnpm', ['exec', 'playwright', ...args], {
  stdio: 'inherit',
  cwd: __dirname + '/..',
  shell: true,
  env: {
    ...process.env,
    // Explicitly disable Vitest globals
    VITEST: '0',
    NODE_NO_WARNINGS: '1',
  },
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

