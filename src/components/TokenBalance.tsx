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

      const balance = await connection.getBalance(publicKey);

      // If balance is zero, airdrop 1 SOL
      if (balance === 0) {
        console.log(`Airdropping 1 SOL to ${publicKey}...`);

        const airdropSignature = await connection.requestAirdrop(
          publicKey,
          LAMPORTS_PER_SOL
        );

        // Confirm the transaction
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature: airdropSignature,
          blockhash,
          lastValidBlockHeight,
        });

        console.log(`Airdrop complete for ${publicKey}`);
      }

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

        /* let accountInfo = await connection.getAccountInfo(
          publicKey,
          "confirmed"
        );

        let bal = accountInfo!.lamports / LAMPORTS_PER_SOL;
        setBalance(bal ?? 0); */

        let account: Account;
        let signature: string;

        try {
          account = await getAccount(
            connection,
            associatedTokenAddress,
            "confirmed"
          );
        } catch (error: unknown) {
          // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
          // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
          // TokenInvalidAccountOwnerError in this code path.
          if (
            error instanceof TokenAccountNotFoundError ||
            error instanceof TokenInvalidAccountOwnerError
          ) {
            // As this isn't atomic, it's possible others can create associated accounts meanwhile.
            try {
              const transaction = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                  publicKey,
                  associatedTokenAddress,
                  publicKey,
                  mint
                )
              );

              signature = await sendTransaction(transaction, connection);
              console.log("Token account created: ", signature);
            } catch (error: unknown) {
              // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
              // instruction error if the associated account exists already.
            }

            // Now this should always succeed
            account = await getAccount(
              connection,
              associatedTokenAddress,
              "confirmed"
            );
          } else {
            throw error;
          }
        }

        if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
        if (!account.owner.equals(publicKey))
          throw new TokenInvalidOwnerError();

        setBalance(parseInt(account.amount.toString()) / 100);
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
        className="text-center text-sm text-zinc-400 mt-3 w-full flex gap-1 justify-center items-center"
      >
        View Token Account
        <Icon icon="ri:external-link-line" className="text-xl" />
      </a>
    </div>
  );
}

export default TokenBalance;
