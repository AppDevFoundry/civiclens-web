/**
 * SWR Middleware for MSW Integration
 *
 * This middleware ensures that all SWR requests wait for MSW to be ready
 * before making API calls. This prevents CORS errors during MSW initialization.
 */

import { Middleware } from 'swr';
import { getMswReadyPromise } from './msw-init';

/**
 * SWR middleware that waits for MSW to be ready before making requests
 */
export const mswMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    // Create a wrapped fetcher that waits for MSW
    const wrappedFetcher = fetcher
      ? async (...args: any[]) => {
          // Wait for MSW to be ready (resolves immediately if mocking is disabled)
          await getMswReadyPromise();

          // Now make the actual request
          return fetcher(...args);
        }
      : fetcher;

    // Call the next middleware with the wrapped fetcher
    return useSWRNext(key, wrappedFetcher, config);
  };
};
