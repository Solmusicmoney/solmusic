import { createAccount } from "@solana/spl-token";
import { connection } from "./connect-to-network";
import { keypair } from "./load-env-keypair";
import { PublicKey } from "@solana/web3.js";

async function createTokenAccount(owner: PublicKey) {
  const tokenAccount = await createAccount(
    connection,
    keypair,
    new PublicKey(process.env.TOKEN_MINT_ACCOUNT!),
    owner
  );

  return tokenAccount;
}

export { createTokenAccount };
