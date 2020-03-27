import { terser } from 'rollup-plugin-terser';
import { cleanOutputFolder } from './build-plugins/clean-output-folder.js';
import { buildFromHtml } from './build-plugins/build-from-html.js';
import * as path from 'path';
import { emitAssets } from './build-plugins/emit-assets.js';
import { reactProductionBuild } from './build-plugins/react-production-build.js';
import babel from 'rollup-plugin-babel';

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
    emitAssets('build/assets.js'),
    reactProductionBuild(),
    babel({
      plugins: [
        ['htm', { pragma: 'React.createElement' }],
        '@babel/syntax-dynamic-import',
        '@babel/syntax-import-meta',
      ],
    }),
    terser(),
  ],
};
