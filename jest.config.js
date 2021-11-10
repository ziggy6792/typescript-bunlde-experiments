module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleDirectories: ['<rootDir>'],
  setupFilesAfterEnv: ['./src/test-utils/setup-after-env.ts'],
};
