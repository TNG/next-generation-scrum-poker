import { terser } from 'rollup-plugin-terser';
import { cleanOutputFolder } from './build-plugins/clean-output-folder.js';
import { buildFromHtml } from './build-plugins/build-from-html.js';
import * as path from 'path';

export default {
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [cleanOutputFolder(), buildFromHtml(path.resolve('index.html')), terser()],
};
