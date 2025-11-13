import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Make the worker available on window for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { msw?: { worker: typeof worker } }).msw = { worker };
}
