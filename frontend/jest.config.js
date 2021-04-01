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
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};
