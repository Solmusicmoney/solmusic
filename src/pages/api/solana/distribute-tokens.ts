import type { NextApiRequest, NextApiResponse } from "next";
import { createTokenMint } from "@/lib/solana/create-token-mint";
import { getExplorerLink } from "@solana-developers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* const tokenMint = await createTokenMint();
  let link = getExplorerLink("address", tokenMint.toString(), "devnet");
  return res.status(200).json({ tokenMint, link });

  if (req.method === "POST") {
    const data = JSON.parse(req.body);

    if (!data) {
      return res.status(500).json({ error: "Missing Data" });
    }

    try {
      

      return res.status(200).json({});
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  } */
}
