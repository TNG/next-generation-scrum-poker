module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig-test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'mjs'],
  moduleNameMapper: {
    // re-map all calls to react(-dom/test-utils) to the aliased CJS versions
    '^react((-dom(/.*)?)?)$': '<rootDir>/node_modules/test-react$1',
    '^/web_modules/react((-dom)?)\\.js$': '<rootDir>/node_modules/test-react$1',
    // There is no CJS version for csz available and we cannot use ESM in node_modules
    '^/web_modules/csz\\.js$': '<rootDir>/web_modules/csz.js',
    // For most snow-packed dependencies, looking in node_modules would be the best choice
    '^/web_modules/(.*)\\.js$': '<rootDir>/node_modules/$1',
    '^(.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};
