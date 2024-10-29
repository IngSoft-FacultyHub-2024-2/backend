import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.ts'], 
  moduleFileExtensions: ['js', 'ts'], 
  collectCoverage: true,
  coverageDirectory: 'coverage', 
};

export default config;
