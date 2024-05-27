import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import bkydLogo from "@/assets/small-logo.svg";
import Image from "next/image";
import WalletContextProvider from "@/components/WalletContextProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <WalletContextProvider>
      <main className={`${inter.className} relative`}>
        <Component {...pageProps} />
        {/* <a href="https://bkyd.studio" target="_blank">
          <div className="p-3 rounded border bg-white shadow-md fixed bottom-2 right-2 flex items-center gap-3 hover:bg-black text-zinc-800 hover:text-[#FED403] transition duration-150 hover:border-black">
            <p className="text-sm font-mono ">Built By</p>
            <Image src={bkydLogo} alt="" className="w-auto h-5" />
          </div>
        </a> */}
      </main>
    </WalletContextProvider>
  );
}
