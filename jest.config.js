const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/$1',
    // Map MSW subpath exports to CommonJS version for Jest compatibility
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.spec.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  // Coverage reporters for visual reports
  coverageReporters: [
    'text',           // Terminal output
    'text-summary',   // Brief summary in terminal
    'html',           // Interactive HTML report (coverage/index.html)
    'lcov',           // For CI/CD tools like Codecov, Coveralls
    'json',           // JSON format for programmatic access
    'json-summary',   // Summary in JSON format
  ],
  coverageDirectory: 'coverage',
  // Allow MSW and @mswjs dependencies to be transformed
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|@bundled-es-modules)/)',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
