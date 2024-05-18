import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { createTokenMint } from "@/lib/solana/create-token-mint";
import { getExplorerLink } from "@solana-developers/helpers";
import { createTokenAccount } from "@/lib/solana/create-token-account";
import { mint } from "@/lib/solana/load-env-mint";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    /* const tokenMint = await createTokenMint();
     */

    if (!mint) {
      return res
        .status(500)
        .json({ error: "Provide mint address in environment" });
    }

    try {
      /* let tokenAccount = await createTokenAccount(mint);
      let session = await getServerSession(req, res, authOptions);

      let link = getExplorerLink("address", tokenAccount.toString(), "devnet");
      return res.status(200).json({ tokenAccount, link }); */
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
