import type { NextApiRequest, NextApiResponse } from "next";
import { keypair } from "@/lib/solana/load-env-keypair";
import {
  createMintToInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  mintTo,
  transferInstructionData,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { destination } = JSON.parse(req.body);

    if (!destination) {
      return res
        .status(500)
        .json({ error: "Please provide user's bonk account address" });
    }
    const connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed"
    );

    let mint = new PublicKey(process.env.NEXT_PUBLIC_BONK_MINT_ADDRESS!);

    destination = new PublicKey(destination);
    const sender = await getAssociatedTokenAddress(
      mint,
      keypair.publicKey,
      false
    );

    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction({
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      }).add(
        createTransferInstruction(
          sender,
          destination,
          keypair.publicKey,
          parseInt(process.env.NEXT_PUBLIC_BONK_REWARD_AMOUNT!) * 10 ** 5 // since bonk is 5 decimals
        )
      );

      transaction.recentBlockhash = blockhash;

      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      const account = await getAccount(connection, destination, "confirmed");

      let balance = parseInt(account.amount.toString()) / 10 ** 5;

      return res.status(200).json({ transactionSignature, balance });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
