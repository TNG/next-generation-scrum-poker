import { terser } from 'rollup-plugin-terser';
import { cleanOutputFolder } from './build-plugins/clean-output-folder.js';
import { emitAssetsFromFile } from './build-plugins/emit-assets-from-file.js';
import html from '@open-wc/rollup-plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

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
    nodeResolve(),
    commonJs({ include: '**/node_modules/**' }),
    html(),
    emitAssetsFromFile('build/assets.js'),
    terser(),
  ],
};
