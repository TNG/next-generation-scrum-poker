import fs from 'fs';
import { minify } from 'html-minifier-terser';
import { render } from './dist-ssr/index-ssr.js';

const htmlUrl = new URL('dist/index.html', import.meta.url);
const ssrMarker = '<!--ssr-outlet-->';

console.log('\npre-rendering HTML...');
const appHtml = render();
const html = fs.readFileSync(htmlUrl, 'utf8');
const prerenderedHtml = html.replace(ssrMarker, appHtml);
if (prerenderedHtml === html) {
  throw new Error(`Could not find ${ssrMarker} marker in HTML.`);
}

console.log('minifying HTML...');
minify(prerenderedHtml, {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeAttributeQuotes: true,
  removeComments: true,
}).then((minifiedHtml) => fs.writeFileSync(htmlUrl, minifiedHtml));
