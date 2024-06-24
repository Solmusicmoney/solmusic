import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Cluster, clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  PhantomWalletAdapterConfig,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = clusterApiUrl(process.env.NEXT_PUBLIC_CLUSTER as Cluster);
  const walletConfig: PhantomWalletAdapterConfig = {
    appName: "Solmusic",
  };
  const wallets = useMemo(
    () => [new SolflareWalletAdapter(), new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
