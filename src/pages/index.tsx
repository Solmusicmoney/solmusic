import MusicPlayer, { PlayerRef } from "@/components/MusicPlayer";
import { NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import songs from "@/lib/songs";
import WalletContextProvider from "@/components/WalletContextProvider";
import NavBar from "@/components/NavBar";
import { Icon } from "@iconify/react/dist/iconify.js";
import Miner from "@/components/Miner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import TokenBalance from "@/components/TokenBalance";
import { mint } from "@/lib/solana/load-env-mint";
import { buildCreateAssociatedTokenAccountTransaction } from "@/lib/solana/create-associated-token-account";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, mintTo } from "@solana/spl-token";
import Image from "next/image";
import bkydLogoMark from "@/assets/bkyd/mark.svg";

const Home: NextPage = function () {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<PlayerRef>(null);
  const [miningProgress, setMiningProgress] = useState(0);
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [minting, setMinting] = useState(false);
  const [walletState, setWalletState] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleTick = async () => {
    if (miningProgress === 60) {
      setMiningProgress(0);
      await distributeToken();
    } else setMiningProgress((prev) => prev + 1);
  };

  const distributeToken = async function () {
    if (!connection || !publicKey) {
      console.log("Wallet not connected");
      return;
    }

    console.log("minting");
    setMinting(true);

    const associatedTokenAddress = await getAssociatedTokenAddress(
      mint,
      publicKey,
      false
    );

    try {
      let data = await (
        await fetch("/api/solana/mint-tokens", {
          method: "POST",
          body: JSON.stringify({
            destination: associatedTokenAddress,
          }),
        })
      ).json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMinting(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pb-10">
      {loaded && (
        <>
          <NavBar />
          <MusicPlayer ref={ref} songs={songs} handleTick={handleTick} />
          <div className="flex flex-col items-center sm:flex-row gap-6 sm:justify-center mb-10 px-4">
            {connected ? (
              <>
                <Miner progress={miningProgress} />
                <TokenBalance minting={minting} />
              </>
            ) : (
              <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-96 p-6 rounded-md">
                <div className="flex flex-col gap-1 items-center text-white justify-center">
                  <Icon icon="ion:warning-outline" className="text-3xl mb-2" />
                  <span className="text-xl font-semibold">
                    Wallet not connected
                  </span>
                </div>
                <p className="text-center text-zinc-400 mt-1">
                  Connect a solana compatible wallet like Phantom or Solflare to
                  earn SOLM while listening to music
                </p>
              </div>
            )}
          </div>

          <div className="px-4 mt-3 flex flex-col gap-5 items-center">
            <p className="text-zinc-300 text-sm mb-10 mx-auto max-w-md text-center">
              This is just an experimental demo, running on Solana Testnet. No
              real funds is being distributed until we launch.
            </p>
            <div className="flex flex-col justify-center">
              <p className="text-zinc-300 text-sm text-center mb-3">
                Startup built by
              </p>
              <a
                href="https://bkyd.studio"
                target="_blank"
                className="flex font-medium text-white"
              >
                <Image
                  src={bkydLogoMark}
                  width={2000}
                  height={2000}
                  alt="Logo"
                  className="w-12 h-auto"
                />
                <span className="ml-3">Backyard Studios</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
