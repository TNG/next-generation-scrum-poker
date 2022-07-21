module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig-test.json',
    },
    API_URL: 'wss://api.url',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'mjs'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.module.css$': '<rootDir>/src/__mocks__/identityObjectProxy.ts',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
  testEnvironment: 'jsdom',
};
