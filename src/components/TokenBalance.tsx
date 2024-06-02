import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector } from "react-redux";
import { RootStateType } from "@/state/store";

function TokenBalance() {
  const mintState = useSelector((state: RootStateType) => state.mint);

  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-80 p-4 px-6 rounded-md">
      <div className="flex gap-1 items-center text-white justify-center">
        {/* <WalletIcon wallet={wallet} /> */}
        <Icon icon="system-uicons:coins" className="text-2xl" />
        <span className="tracking-wider">Token Balance</span>
      </div>
      <p
        className={`animate__animated ${
          mintState.minting
            ? "animate__flash text-purple-400 animate__infinite	infinite"
            : "text-white"
        } text-center text-3xl mt-3  dm-mono-regular tracking-wider`}
      >
        {mintState.tokenBalance}
      </p>
      <a
        href={`https://explorer.solana.com/address/${mintState.associatedTokenAddress}?cluster=${process.env.NEXT_PUBLIC_CLUSTER}`}
        target="_blank"
        className="text-center hover:text-yellow-300 text-sm text-zinc-400 mt-3 w-full flex gap-1 justify-center items-center"
      >
        View Token Account
        <Icon icon="ri:external-link-line" className="text-xl" />
      </a>
    </div>
  );
}

export default TokenBalance;
