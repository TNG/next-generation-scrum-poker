module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig-test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'mjs'],
  moduleNameMapper: {
    // re-map all calls to react(-dom/test-utils) to the aliased CJS versions
    '^react((-dom(/.*)?)?)$': '<rootDir>/node_modules/test-react$1',
    // There is no CJS version for csz available and we cannot use ESM in node_modules
    '^csz$': '<rootDir>/src/test-utils/csz.js',
    // Remove extensions from imports so that Jest can resolve .js as .ts
    '^(.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};
