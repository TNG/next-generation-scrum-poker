import preact from '@preact/preset-vite';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vitest/config';
import { frontendPort, frontendPreviewPort } from './config';

export default defineConfig({
  plugins: [
    preact(),
    replace({
      API_URL: JSON.stringify(process.env.API_URL || 'ws://localhost:8080'),
      preventAssignment: true,
    }),
  ],
  server: {
    port: frontendPort,
    strictPort: true,
  },
  preview: {
    port: frontendPreviewPort,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['vitest-setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
