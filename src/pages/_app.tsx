import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import bkydLogo from "@/assets/small-logo.svg";
import Image from "next/image";
import WalletContextProvider from "@/components/WalletContextProvider";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          <main className={`${inter.className} relative`}>
            <Component {...pageProps} />
          </main>
        </WalletContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}
