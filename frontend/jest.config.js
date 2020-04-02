module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig-test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'mjs'],
  moduleNameMapper: {
    '^/web_modules/(.*)\\.js': '<rootDir>/web_modules/$1',
    '^(.*)\\.js': '$1',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
