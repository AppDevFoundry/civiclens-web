/**
 * MSW Mocks Entry Point
 *
 * This file exports the mock setup for both browser and test environments.
 *
 * Usage:
 * - For browser: import { worker, startMocking } from './mocks'
 * - For tests: import { handlers } from '../__tests__/mocks/handlers'
 */

export { worker, startMocking, browserHandlers } from './browser';
export {
  mockArticles,
  mockComments,
  mockTags,
  mockUsers,
  currentUser,
  setCurrentUser,
  getUserFromToken,
} from './data';
