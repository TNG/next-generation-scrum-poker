import { minify } from 'html-minifier-terser';
import { createServer } from 'vite';

export default () => ({
  name: 'prerender-html',
  async transformIndexHtml(html) {
    console.log('\npre-rendering HTML...');
    const vite = await createServer();
    const { render } = await vite.ssrLoadModule('./src/index-ssr.tsx');
    const appHtml = await render();
    await vite.close();
    const prerenderedHtml = html.replace('<!--ssr-outlet-->', appHtml);

    console.log('minifying HTML...');
    return minify(prerenderedHtml, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeAttributeQuotes: true,
      removeComments: true,
    });
  },
});
