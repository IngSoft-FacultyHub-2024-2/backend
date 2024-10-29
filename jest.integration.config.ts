import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', 
  testEnvironment: 'node',
  roots: ['./tests/integration'], 
  testMatch: ['**/*.test.ts'], 
  moduleFileExtensions: ['js', 'ts'], 
};

export default config;