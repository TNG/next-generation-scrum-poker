import preact from '@preact/preset-vite';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vitest/config';
import { frontendPort } from './config';

export default defineConfig({
  plugins: [
    preact(),
    replace({
      API_URL: JSON.stringify(process.env.API_URL || 'ws://localhost:8080'),
      preventAssignment: true,
    }),
  ],
  ssr: {
    format: 'cjs',
  },
  server: {
    port: frontendPort,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    setupFiles: ['@testing-library/jest-dom', 'vitest-setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
