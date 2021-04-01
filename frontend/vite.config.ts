import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import prerender from './plugins/prerenderHtml';

export default defineConfig({
  plugins: [preact(), prerender()],
});
