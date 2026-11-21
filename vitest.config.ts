import { defineConfig } from 'vitest/config';

// Unit tests for pure code (engines, shared helpers). No DOM needed yet.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
});
