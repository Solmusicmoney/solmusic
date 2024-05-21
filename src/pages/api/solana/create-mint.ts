import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { createTokenMint } from "@/lib/solana/create-token-mint";
import { getExplorerLink } from "@solana-developers/helpers";
import { updateTokenMetadata } from "@solana/spl-token";
import { uploadMetadataForToken } from "@/lib/solana/umi-token-metadata";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const offChainMetadata = {
      name: "Solmusic",
      symbol: "SOLM",
      description: "Millions of Songs, Earn while you listen, All on Solmusic",
      uri: "https://arweave.net/hoR8u88CapiUHGeC0r4prBtPMVl36dQCsWCFSVIbrgg",
    };

    const metadataSignature = await uploadMetadataForToken(offChainMetadata);

    return res.status(200).json({ metadataSignature });
    const data = JSON.parse(req.body);

    if (!data) {
      return res.status(500).json({ error: "Missing Data" });
    }

    try {
      let session = await getServerSession(req, res, authOptions);

      return res.status(200).json({});
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
