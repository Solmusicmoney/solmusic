import type { NextApiRequest, NextApiResponse } from "next";
import { connection } from "@/lib/solana/connect-to-network";
import { keypair } from "@/lib/solana/load-env-keypair";
import { createMintToInstruction, getAccount, mintTo } from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { mint } from "@/lib/solana/load-env-mint";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { destination } = JSON.parse(req.body);

    if (!destination) {
      return res
        .status(500)
        .json({ error: "Please provide user's token account address" });
    }

    destination = new PublicKey(destination);

    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction({
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      }).add(
        createMintToInstruction(
          mint,
          destination,
          keypair.publicKey,
          parseInt(process.env.MINT_AMOUNT!) * 10 ** 2 // because we created the mint with 2 decimals
        )
      );

      transaction.recentBlockhash = blockhash;

      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      const account = await getAccount(connection, destination, "confirmed");

      let balance = parseInt(account.amount.toString()) / 100;

      return res.status(200).json({ transactionSignature, balance });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
