import { terser } from 'rollup-plugin-terser';
import { cleanOutputFolder } from './build-plugins/clean-output-folder.js';
import { emitAssetsFromFile } from './build-plugins/emit-assets-from-file.js';
import { handleWebModules } from './build-plugins/handle-web-modules.js';
import html from '@open-wc/rollup-plugin-html';

export default {
  input: 'index.html',
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false,
  },
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name]-[hash].js',
  },
  plugins: [
    cleanOutputFolder(),
    html(),
    emitAssetsFromFile('build/assets.js'),
    handleWebModules(),
    terser(),
  ],
};
