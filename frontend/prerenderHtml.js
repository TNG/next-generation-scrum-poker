const path = require('path');
const fs = require('fs');
const { render } = require('./dist-ssr/index-ssr');
const { minify } = require('html-minifier-terser');

const htmlPath = path.join(__dirname, 'dist/index.html');
const ssrMarker = '<!--ssr-outlet-->';

console.log('\npre-rendering HTML...');
const appHtml = render();
const html = fs.readFileSync(htmlPath, 'utf8');
const prerenderedHtml = html.replace(ssrMarker, appHtml);
if (prerenderedHtml === html) {
  throw new Error(`Could not find ${ssrMarker} marker in HTML.`);
}

console.log('minifying HTML...');
const minifiedHtml = minify(prerenderedHtml, {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeAttributeQuotes: true,
  removeComments: true,
});
fs.writeFileSync(htmlPath, minifiedHtml);
