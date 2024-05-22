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
import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile";
import { isMobile } from "react-device-detect";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = clusterApiUrl(process.env.NEXT_PUBLIC_CLUSTER as Cluster);
  const walletConfig: PhantomWalletAdapterConfig = {
    appName: "Solmusic",
  };
  const wallets = useMemo(
    () => /* {
    if (isMobile) {
      return [
        new SolanaMobileWalletAdapter({
          addressSelector: createDefaultAddressSelector(),
          appIdentity: {
            name: "Solmusic",
            uri: "https://app.solmusic.fun",
            icon: "https://arweave.net/heHxb452fNXSW_SScXgg8d-exoLIz3seiCZ1oK8mX_s",
          },
          authorizationResultCache: createDefaultAuthorizationResultCache(),
          cluster: network,
          onWalletNotFound: createDefaultWalletNotFoundHandler(),
        }),
      ];
    } else {
      return [
        new PhantomWalletAdapter(walletConfig),
        new SolflareWalletAdapter(walletConfig),
      ];
    }
  } */ [
      new PhantomWalletAdapter(walletConfig),
      new SolflareWalletAdapter(walletConfig),
    ],
    [network]
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
