export async function initMocks() {
  // Only enable mocks if environment variable is set
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    return;
  }

  if (typeof window === 'undefined') {
    // Server-side - use Node.js server
    const { server } = await import('./server');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
    console.log('[MSW] Server-side mocking enabled');
    return;
  }

  // Client-side - use browser service worker
  const { worker } = await import('./browser');

  // Start the worker
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests (static assets, etc.)
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

// Initialize server-side mocking immediately when imported on server
if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  import('./server').then(({ server }) => {
    server.listen({
      onUnhandledRequest: 'bypass',
    });
    console.log('[MSW] Server-side mocking enabled');
  });
}
