import type { NextApiRequest, NextApiResponse } from "next";
import { keypair } from "@/lib/solana/load-env-keypair";
import {
  Account,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
  mintTo,
} from "@solana/spl-token";
import {
  Cluster,
  Connection,
  LAMPORTS_PER_SOL,
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
    const data = JSON.parse(req.body);
    const publicKey = new PublicKey(data.publicKey);
    const associatedTokenAddress = new PublicKey(data.associatedTokenAddress);

    if (!publicKey || !associatedTokenAddress) {
      return res.status(500).json({
        error: "Missing fields 'publicKey' and 'associatedTokenAddress'",
      });
    }

    const connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed"
    );

    try {
      const payerBalance = await connection.getBalance(keypair.publicKey);
      // If balance is zero, airdrop 3 SOL
      if (payerBalance === 0) {
        throw new Error(
          `Insufficient funds in payer: ${keypair.publicKey.toBase58()} to create bonk token account for: ${associatedTokenAddress}`
        );
      }

      // create associated token account
      let account: Account;
      let signature: string = "";
      let mint = new PublicKey(process.env.NEXT_PUBLIC_BONK_MINT_ADDRESS!);

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
            const { blockhash, lastValidBlockHeight } =
              await connection.getLatestBlockhash();

            const transaction = new Transaction({
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
            }).add(
              createAssociatedTokenAccountInstruction(
                keypair.publicKey,
                associatedTokenAddress,
                publicKey,
                mint
              )
            );

            signature = await sendAndConfirmTransaction(
              connection,
              transaction,
              [keypair]
            );
            console.log("Token account created: ", signature);
          } catch (error: unknown) {
            // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
            // instruction error if the associated account exists already.
            throw error;
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
      if (!account.owner.equals(publicKey)) throw new TokenInvalidOwnerError();

      let balance = parseInt(account.amount.toString()) / 10 ** 5;

      return res.status(200).json({ balance, signature });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
