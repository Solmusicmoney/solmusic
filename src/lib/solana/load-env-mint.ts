import { PublicKey } from "@solana/web3.js";

const mint = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ACCOUNT!);

export { mint };
