// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'));

// Mock environment variables if needed
process.env.API_URL = 'https://api.realworld.io/api';

// Note: MSW (Mock Service Worker) is available for API mocking in tests
// Import { server } from '__tests__/utils/test-server' in tests that need API mocking
