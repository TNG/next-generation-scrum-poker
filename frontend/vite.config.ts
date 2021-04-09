import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  plugins: [
    preact(),
    replace({
      API_URL: JSON.stringify('wss://api.scrum-poker.aws.tngtech.com'),
      preventAssignment: true,
    }),
  ],
});
