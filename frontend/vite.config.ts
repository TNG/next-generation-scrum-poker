import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  plugins: [
    preact(),
    replace({
      API_URL: JSON.stringify(process.env.API_URL || 'ws://localhost:8080'),
      preventAssignment: true,
    }),
  ],
});
