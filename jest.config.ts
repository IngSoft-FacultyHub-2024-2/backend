import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'node', // Set the test environment (node for server-side testing)
  verbose: true, // Optional: Enable detailed test results in the output
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'], // Matches test files
  moduleFileExtensions: ['js', 'ts'], // Recognizes JavaScript and TypeScript files
  collectCoverage: true, // Optional: Collects test coverage information
  coverageDirectory: 'coverage', // Output directory for coverage reports
};

export default config;
