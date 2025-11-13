export async function initMocks() {
  if (typeof window === 'undefined') {
    // Server-side - no mocking needed for now
    return;
  }

  // Only enable mocks if environment variable is set
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    console.log('[MSW] Mocking disabled');
    return;
  }

  const { worker } = await import('./browser');

  // Start the worker
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests (static assets, etc.)
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
