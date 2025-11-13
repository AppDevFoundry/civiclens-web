/**
 * MSW Initialization Module
 *
 * This module provides a Promise-based system to track MSW readiness.
 * It ensures data fetching only happens after MSW is fully initialized.
 */

let mswReadyPromise: Promise<void> | null = null;
let resolveMswReady: (() => void) | null = null;

/**
 * Initialize the MSW ready promise
 * This should be called at module load time
 */
export function initMswReadyPromise() {
  if (!mswReadyPromise) {
    mswReadyPromise = new Promise<void>((resolve) => {
      resolveMswReady = resolve;
    });
  }
  return mswReadyPromise;
}

/**
 * Mark MSW as ready
 * This should be called after MSW worker starts
 */
export function setMswReady() {
  if (resolveMswReady) {
    resolveMswReady();
    resolveMswReady = null;
  }
}

/**
 * Get the MSW ready promise
 * Components can await this before making API calls
 */
export function getMswReadyPromise(): Promise<void> {
  // If mocking is disabled, resolve immediately
  if (process.env.NEXT_PUBLIC_ENABLE_API_MOCKING !== 'true') {
    return Promise.resolve();
  }

  // If promise doesn't exist, initialize it
  if (!mswReadyPromise) {
    initMswReadyPromise();
  }

  return mswReadyPromise!;
}

/**
 * Check if MSW is enabled
 */
export function isMswEnabled(): boolean {
  return typeof window !== 'undefined' &&
         process.env.NEXT_PUBLIC_ENABLE_API_MOCKING === 'true';
}
