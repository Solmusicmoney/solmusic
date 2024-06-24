import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import WalletContextProvider from "@/components/WalletContextProvider";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_HUDDLE01_PROJECT_ID!,
  options: {
    // `activeSpeakers` will be most active `n` number of peers, by default it's 8
    activeSpeakers: {
      size: 1,
    },
  },
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          {/* <LivestreamProvider>
          </LivestreamProvider> */}
          <HuddleProvider client={huddleClient}>
            <main className={`${inter.className} relative`}>
              <Component {...pageProps} />
            </main>
          </HuddleProvider>
        </WalletContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}
