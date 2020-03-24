module.exports = {
  moduleFileExtensions: ["js", "json", "ts", 'mjs'],
  transformIgnorePatterns: [],
  "moduleNameMapper": {
    "^(.*)\\.js": "$1"
  },
  transform: {
    '.*': require.resolve('babel-jest')
  }
};
