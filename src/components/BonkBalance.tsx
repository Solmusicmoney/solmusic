import React, { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootStateType } from "@/state/store";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import {
  getOrCreateBonkTokenAccount,
  setBonkTokenAddress,
} from "@/state/mint/mintSlice";
import Image from "next/image";
import bonkImage from "@/assets/rewards/bonk logo.jpg";

function BonkBalance() {
  const mintState = useSelector((state: RootStateType) => state.mint);
  const dispatch = useDispatch<DispatchType>();

  const { data, isSuccess } = useQuery({
    queryKey: ["getBonkAssociatedTokenAddress"],
    queryFn: async function () {
      return await getAssociatedTokenAddress(
        new PublicKey(mintState.bonk.mintAddress),
        new PublicKey(mintState.publicKey!),
        false
      );
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setBonkTokenAddress(data.toBase58())); // set bonk token address
      dispatch(getOrCreateBonkTokenAccount()); // get bonk token account details or create a new one
    }
  }, [isSuccess, data, dispatch]);

  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-80 p-4 px-6 rounded-md">
      <div className="flex gap-2 items-center text-white justify-center">
        {/* <WalletIcon wallet={wallet} /> */}
        {/* <Icon icon="system-uicons:coins" className="text-2xl" /> */}
        <Image
          src={bonkImage}
          alt="bonk logo"
          width={500}
          height={500}
          className="w-[26px] h-auto rounded-full"
        />
        <span className="tracking-wider">Bonk Balance</span>
      </div>
      <p
        className={`animate__animated ${
          mintState.minting
            ? "animate__flash text-purple-400 animate__infinite	infinite"
            : "text-white"
        } text-center text-3xl mt-3  dm-mono-regular tracking-wider`}
      >
        {mintState.bonk.bonkBalance}
      </p>
      <a
        href={`https://explorer.solana.com/address/${mintState.bonk.associatedTokenAddress}?cluster=mainnet-beta`}
        target="_blank"
        className="text-center hover:text-yellow-300 text-sm text-zinc-400 mt-3 w-full flex gap-1 justify-center items-center"
      >
        View Bonk Account
        <Icon icon="ri:external-link-line" className="text-xl" />
      </a>
    </div>
  );
}

export default BonkBalance;
