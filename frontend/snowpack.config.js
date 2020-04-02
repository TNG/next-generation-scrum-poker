const pkg = require('./package.json');

module.exports = {
  webDependencies: Object.keys(pkg.dependencies),
  installOptions: {
    clean: true,
    strict: false,
  },
};
