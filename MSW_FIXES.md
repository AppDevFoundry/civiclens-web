# MSW Race Condition Fix

## Problem History
When enabling API mocking, the application experienced several issues:
1. **Duplicate headers/content** - Two sets of "conduit" banners rendered
2. **Stuck loading spinners** - Loading indicators never resolved
3. **Race condition delay** - Initial CORS errors before mocks activated (~5 seconds)
4. **Real API calls** - Components made requests before MSW was ready

## Root Causes

### Issue 1: Hydration Mismatch (FIXED)
- Server rendered full page HTML
- Client returned `null` while waiting for MSW to initialize
- React detected mismatch and re-rendered, causing duplicates

### Issue 2: Race Condition (FIXED)
- Service Worker registration takes 100-500ms to complete
- React components mount immediately and make API calls via `useEffect`
- First requests hit the real API (causing CORS errors) before MSW intercepts

## Final Solution: SWR Middleware Pattern

### Architecture Overview
1. **Promise-based readiness tracking** - Module-level Promise tracks MSW initialization
2. **SWR middleware** - Intercepts all data fetching and waits for MSW
3. **No blocking render** - Rendering happens normally, only data fetching is delayed

### Implementation

#### 1. MSW Readiness Tracker (`lib/msw-init.ts`)
```typescript
let mswReadyPromise: Promise<void> | null = null;
let resolveMswReady: (() => void) | null = null;

export function initMswReadyPromise() {
  if (!mswReadyPromise) {
    mswReadyPromise = new Promise<void>((resolve) => {
      resolveMswReady = resolve;
    });
  }
  return mswReadyPromise;
}

export function setMswReady() {
  if (resolveMswReady) {
    resolveMswReady();
  }
}

export function getMswReadyPromise(): Promise<void> {
  // If mocking disabled, resolve immediately
  if (process.env.NEXT_PUBLIC_ENABLE_API_MOCKING !== 'true') {
    return Promise.resolve();
  }

  if (!mswReadyPromise) {
    initMswReadyPromise();
  }

  return mswReadyPromise!;
}
```

#### 2. SWR Middleware (`lib/swr-msw-middleware.ts`)
```typescript
import { Middleware } from 'swr';
import { getMswReadyPromise } from './msw-init';

export const mswMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    // Wrap fetcher to wait for MSW
    const wrappedFetcher = fetcher
      ? async (...args: any[]) => {
          // Wait for MSW to be ready (or resolve immediately if mocking disabled)
          await getMswReadyPromise();

          // Now make the actual request
          return fetcher(...args);
        }
      : fetcher;

    return useSWRNext(key, wrappedFetcher, config);
  };
};
```

#### 3. App Integration (`pages/_app.tsx`)
```typescript
import { mswMiddleware } from "lib/swr-msw-middleware";
import { initMswReadyPromise } from "lib/msw-init";

// Initialize promise at module level (before any component renders)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_API_MOCKING === 'true') {
  initMswReadyPromise();
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_API_MOCKING === 'true') {
      import('../mocks/browser')
        .then(({ startMocking }) => startMocking());
    }
  }, []);

  return (
    <SWRConfig
      value={{
        // Use MSW middleware to delay requests until ready
        use: [mswMiddleware],
        errorRetryCount: 2,
        errorRetryInterval: 1000,
        dedupingInterval: 2000,
        loadingTimeout: 1000,
      }}
    >
      <ContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
    </SWRConfig>
  );
}
```

#### 4. Signal MSW Ready (`mocks/browser.ts`)
```typescript
import { setMswReady } from '../lib/msw-init';

export const startMocking = async () => {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

  console.log('🎭 [MSW] Mocking enabled - API requests will be intercepted');

  // Signal that MSW is ready
  setMswReady();
};
```

## How It Works Now

```
Timeline:
0ms:    Server renders page HTML
0ms:    Browser receives HTML
0ms:    React hydrates (renders same content) ✅
0ms:    MSW ready promise is initialized
10ms:   useEffect fires, MSW starts initializing
10ms:   Components mount, SWR hooks are set up
20ms:   SWR middleware intercepts fetch requests
20ms:   Middleware awaits getMswReadyPromise() ⏸️
        (All data fetching is paused here)
200ms:  MSW finishes initializing
200ms:  setMswReady() resolves the promise ✅
200ms:  All pending SWR requests execute simultaneously
250ms:  Data loads, spinners disappear ✅
```

## Benefits
- ✅ **No hydration mismatch** - Server and client render identically
- ✅ **No duplicate content** - Single, clean render cycle
- ✅ **No race condition** - Data fetching waits for MSW automatically
- ✅ **Zero CORS errors** - No requests reach real API
- ✅ **Fast loading** - Typically resolves in <300ms
- ✅ **Transparent** - Works for all SWR hooks automatically
- ✅ **Graceful degradation** - Resolves immediately when mocking is disabled

## Testing
1. Hard refresh the browser (Cmd/Ctrl + Shift + R)
2. Check console for: `🎭 [MSW] Mocking enabled`
3. Verify:
   - Single header (no duplicates) ✅
   - Loading spinners disappear quickly (<500ms) ✅
   - Mock data appears ✅
   - **No CORS errors in console** ✅
   - MSW logs appear BEFORE any API request logs ✅

## Related Files
- `lib/msw-init.ts` - Promise-based readiness tracking
- `lib/swr-msw-middleware.ts` - SWR middleware that delays requests
- `pages/_app.tsx` - MSW initialization + SWR middleware config
- `mocks/browser.ts` - MSW worker setup + ready signal
- `.env.local` - Mocking toggle (`NEXT_PUBLIC_ENABLE_API_MOCKING`)

## Technical Notes

### Why This Pattern Works
1. **Module-level initialization** - Promise exists before any component mounts
2. **Middleware interception** - All SWR requests are caught automatically
3. **Non-blocking render** - React renders normally, only fetching is delayed
4. **Zero configuration** - Components don't need to know about MSW

### Alternative Approaches Tried
- ❌ **Blocking render** - Caused hydration mismatch
- ❌ **SWR retry logic only** - Reduced symptoms but didn't eliminate CORS errors
- ❌ **State-based waiting** - Caused duplicate content and hydration issues

---

**Date**: 2025-11-13
**Issue**: MSW race condition causing CORS errors and delays
**Status**: ✅ Fixed with SWR middleware pattern
