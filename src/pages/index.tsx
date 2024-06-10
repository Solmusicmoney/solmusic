import MusicPlayer from "@/components/MusicPlayer";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Icon } from "@iconify/react/dist/iconify.js";
import TokenMint from "@/components/TokenMint";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenBalance from "@/components/TokenBalance";
import Disclaimer from "@/components/Disclaimer";
import ConnectWallet from "@/components/ConnectWallet";
import Queue from "@/components/Queue";
import Playlist from "@/components/Playlist";
import Lyrics from "@/components/Lyrics";
import BonkBalance from "@/components/BonkBalance";

const Home = function () {
  const [loaded, setLoaded] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="pb-10">
      {loaded && (
        <>
          {connected ? (
            <div>
              <NavBar />
              <MusicPlayer />
              <div className="flex flex-col items-center sm:flex-row gap-6 sm:justify-center mb-16 px-4">
                <TokenMint />
                <TokenBalance />
                <BonkBalance />
              </div>
              <div className="mb-24 flex flex-col sm:flex-row gap-10 md:gap-8 max-w-7xl mx-auto px-4">
                <Queue />
                <Lyrics />
                <Playlist />
              </div>
              <Disclaimer />
            </div>
          ) : (
            <ConnectWallet />
          )}
        </>
      )}
    </div>
  );
};

export default Home;

const WalletNotConnectedCard = function () {
  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-96 p-6 rounded-md">
      <div className="flex flex-col gap-1 items-center text-white justify-center">
        <Icon icon="ion:warning-outline" className="text-3xl mb-2" />
        <span className="text-xl font-semibold">Wallet not connected</span>
      </div>
      <p className="text-center text-zinc-400 mt-1">
        Connect a solana compatible wallet like Phantom or Solflare to earn SOLM
        while listening to music
      </p>
    </div>
  );
};
