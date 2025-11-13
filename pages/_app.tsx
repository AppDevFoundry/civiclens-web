import Head from "next/head";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Layout from "components/common/Layout";
import ContextProvider from "lib/context";
import { mswMiddleware } from "lib/swr-msw-middleware";
import { initMswReadyPromise } from "lib/msw-init";
import "styles.css";

// Initialize MSW ready promise at module level (before any component renders)
// This ensures the promise exists before any SWR request is made
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_API_MOCKING === 'true') {
  initMswReadyPromise();
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize MSW in the browser only
    // The middleware will ensure requests wait for MSW to be ready
    const enableMocking = process.env.NEXT_PUBLIC_ENABLE_API_MOCKING === 'true';

    if (enableMocking) {
      // Dynamically import MSW to avoid SSR issues
      import('../mocks/browser')
        .then(({ startMocking }) => startMocking())
        .catch((error) => {
          console.error('Failed to start MSW:', error);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <SWRConfig
        value={{
          // Use MSW middleware to delay requests until MSW is ready
          use: [mswMiddleware],
          // Retry configuration (less aggressive now that timing is handled)
          errorRetryCount: 2,
          errorRetryInterval: 1000,
          // Dedupe requests within 2 seconds
          dedupingInterval: 2000,
          // Show loading state for at least this long (prevents flashing)
          loadingTimeout: 1000,
        }}
      >
        <ContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContextProvider>
      </SWRConfig>
    </>
  );
}
