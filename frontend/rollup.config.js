import * as path from 'path';
import { terser } from 'rollup-plugin-terser';
import { buildFromHtml } from './build-plugins/build-from-html.js';
import { cleanOutputFolder } from './build-plugins/clean-output-folder.js';
import { emitAssetsFromFile } from './build-plugins/emit-assets-from-file.js';
import { reactProductionBuild } from './build-plugins/react-production-build.js';

export default {
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false,
  },
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    cleanOutputFolder(),
    buildFromHtml(path.resolve('index.html')),
    emitAssetsFromFile('build/assets.js'),
    reactProductionBuild(),
    terser(),
  ],
};
