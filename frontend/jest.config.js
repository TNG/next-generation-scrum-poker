module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig-test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'mjs'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/fileMock.js',
    // There is no CJS version for csz available and we cannot use ESM in node_modules
    '^csz$': '<rootDir>/src/test-utils/csz.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};
