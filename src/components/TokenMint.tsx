import React, { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootStateType } from "@/state/store";
import {
  distributeBonkTokens,
  getOrCreateTokenAccount,
  mintTokens,
  resetMint,
  setPublicKey,
  setTokenAddress,
} from "@/state/mint/mintSlice";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

function TokenMint() {
  const mintState = useSelector((state: RootStateType) => state.mint);
  const dispatch = useDispatch<DispatchType>();

  useEffect(() => {
    if (mintState.progress === mintState.mintInterval) {
      // dispatch tokens and reset mint
      dispatch(mintTokens());
      dispatch(distributeBonkTokens());
      dispatch(resetMint());
    } else {
      const max = mintState.mintInterval;

      const percentage = (mintState.progress / max) * 100;

      const progressBar = document.getElementById("loader");
      progressBar!.style.width = `${percentage}%`;
    }
  }, [mintState.progress]);

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    dispatch(setPublicKey(publicKey?.toBase58()));
  }, [dispatch, connection, publicKey]);

  const { data, isSuccess } = useQuery({
    queryKey: ["getAssociatedTokenAddress"],
    queryFn: async function () {
      return await getAssociatedTokenAddress(
        new PublicKey(mintState.mintAddress),
        new PublicKey(mintState.publicKey!),
        false
      );
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setTokenAddress(data.toBase58())); // set token address
      dispatch(getOrCreateTokenAccount()); // get token account details
    }
  }, [isSuccess, data, dispatch]);

  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-80 p-4 px-6 rounded-md">
      <div className="flex gap-1 items-center text-white justify-center">
        <Icon icon="ph:gear-light" className="text-2xl" />
        <span className="tracking-wider">Mint</span>
      </div>
      <div className="h-5 w-full my-5 bg-zinc-700 rounded overflow-hidden animate__animated animate__fadeIn">
        <div id="loader" className="h-full w-1/2 bg-zinc-400"></div>
      </div>
      <p className="text-center text-sm text-zinc-400 mt-3">
        2 tokens per minute listening to music
      </p>
    </div>
  );
}

export default TokenMint;
