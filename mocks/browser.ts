/**
 * MSW Browser Worker Setup
 * Initializes Mock Service Worker for browser development
 */

import { setupWorker } from 'msw/browser';
import { browserHandlers } from './browser-handlers';
import { setMswReady } from '../lib/msw-init';

export const worker = setupWorker(...browserHandlers);

// Optional: Enable logging to see which requests are being mocked
export const startMocking = async () => {
  await worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unmocked requests (like Next.js internals)
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

  console.log(
    '%c🎭 [MSW] Mocking enabled - API requests will be intercepted',
    'color: #10b981; font-weight: bold; font-size: 14px;'
  );
  console.log(
    '%c✅ Ready to mock requests to: ' + (process.env.NEXT_PUBLIC_API_URL || 'https://conduit.productionready.io/api'),
    'color: #3b82f6; font-weight: bold;'
  );
  console.log(
    '%c💡 To disable mocking: set NEXT_PUBLIC_ENABLE_API_MOCKING=false',
    'color: #6b7280; font-style: italic;'
  );

  // Signal that MSW is ready
  setMswReady();
};

// Export for manual control if needed
export { browserHandlers };
