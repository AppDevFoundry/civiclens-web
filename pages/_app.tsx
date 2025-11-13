import Head from "next/head";
import React from "react";
import type { AppProps } from "next/app";

import Layout from "components/common/Layout";
import ContextProvider from "lib/context";
import "styles.css";

// Initialize MSW mocking - must be synchronous for server-side
if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  // Server-side: require synchronously to ensure it's ready before SSR
  if (typeof window === "undefined") {
    // eslint-disable-next-line
    const { server } = require("../mocks/server");
    server.listen({
      onUnhandledRequest: "bypass",
    });
  } else {
    // Client-side: initialize browser mocking
    import("../mocks").then(({ initMocks }) => {
      initMocks();
    });
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
    </Head>
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  </>
);

export default MyApp;
