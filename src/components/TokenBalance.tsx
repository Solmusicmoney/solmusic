import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { buildCreateAssociatedTokenAccountTransaction } from "@/lib/solana/create-associated-token-account";
import { mint } from "@/lib/solana/load-env-mint";
import {
  Account,
  AccountLayout,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

type Props = {
  minting: boolean;
};

function TokenBalance({ minting }: Props) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [ata, setATA] = useState("");

  useEffect(() => {
    (async () => {
      if (!connection || !publicKey) {
        console.log("Wallet not connected");
        return;
      }

      console.log("Wallet connected");

      try {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false
        );

        connection.onAccountChange(
          associatedTokenAddress,
          (updatedAccountInfo) => {
            const data = Buffer.from(updatedAccountInfo.data);
            const accountData = AccountLayout.decode(data);

            setBalance(parseInt(accountData.amount.toString()) / 100);
          },
          "confirmed"
        );

        let data = await (
          await fetch("/api/solana/create-token-account", {
            method: "POST",
            body: JSON.stringify({
              associatedTokenAddress,
              publicKey,
            }),
          })
        ).json();

        if (data.error) {
          throw new Error(data.error);
        }

        setBalance(data.balance);
        setATA(associatedTokenAddress.toBase58());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [connection, publicKey]);

  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-80 p-4 px-6 rounded-md">
      <div className="flex gap-1 items-center text-white justify-center">
        {/* <WalletIcon wallet={wallet} /> */}
        <Icon icon="system-uicons:coins" className="text-2xl" />
        <span className="tracking-wider">Token Balance</span>
      </div>
      <p
        className={`animate__animated ${
          minting
            ? "animate__flash text-purple-400 animate__infinite	infinite"
            : "text-white"
        } text-center text-3xl mt-3  dm-mono-regular tracking-wider`}
      >
        {balance}
      </p>
      <a
        href={`https://explorer.solana.com/address/${ata}?cluster=${process.env.NEXT_PUBLIC_CLUSTER}`}
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
