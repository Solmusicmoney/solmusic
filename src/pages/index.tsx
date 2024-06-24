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
import BroadcasterCameraStream from "@/components/BroadcasterCameraStream";
import { useSelector } from "react-redux";
import { RootStateType } from "@/state/store";

const Home = function () {
  const [loaded, setLoaded] = useState(false);
  const { connected } = useWallet();

  const livestreamState = useSelector(
    (state: RootStateType) => state.livestream
  );

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
              <div className="flex flex-col md:flex-row justify-center px-4 pb-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-4 ">
                {livestreamState.broadcaster.live && (
                  <div className="md:max-h-[500px] h-[400px] md:h-auto mt-5 rounded-md overflow-hidden md:w-6/12 md:mr-16 bg-black flex items-center">
                    <BroadcasterCameraStream />
                  </div>
                )}
                <div className="md:w-6/12">
                  <MusicPlayer />
                </div>
              </div>
              <div className="flex flex-col mt-6 items-center sm:flex-row gap-6 sm:justify-center mb-16 px-4">
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
