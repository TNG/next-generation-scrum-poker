const { wrapRollupPlugin } = require('es-dev-server-rollup');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  open: true,
  watch: true,
  nodeResolve: true,
  appIndex: 'index.html',
  plugins: [wrapRollupPlugin(commonjs({ include: '**/node_modules/**' }))],
};
