import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'node', // Set the test environment (node for server-side testing)
  roots: ['./tests/integration'], // Specify the root directory for integration tests
  testMatch: ['**/*.test.ts'], // Match test files in the specified directory
  moduleFileExtensions: ['js', 'ts'], // Recognizes JavaScript and TypeScript files
  collectCoverage: true, // Collects test coverage information
  coverageDirectory: 'coverage/integration', // Output directory for coverage reports
};

export default config;