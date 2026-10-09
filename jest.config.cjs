module.exports = {
  watchman: false,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
  },
  transform: { '^.+\\.[jt]sx?$': ['babel-jest', {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
    plugins: [require.resolve('./tests/vite-env.cjs')],
  }] },
  collectCoverageFrom: ['src/features/cart/**/*.{ts,tsx}', 'src/features/products/**/*.{ts,tsx}', 'src/hooks/usePagination.ts'],
  coverageDirectory: 'reports/testing/coverage',
  coverageReporters: ['text', 'html', 'json-summary', 'lcov'],
  coverageThreshold: { global: { statements: 70, branches: 70, functions: 70, lines: 70 } },
  clearMocks: true,
};
