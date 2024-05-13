import { PublicKey } from "@solana/web3.js";
import { connection } from "./connect-to-network";
import { isValidSolanaPublicKey } from "./validate-public-key";
const { LAMPORTS_PER_SOL } = require("@solana/web3.js");

// Get the SOL balance of an account given its public key
async function checkBalance(pubKey: PublicKey) {
  if (!isValidSolanaPublicKey(pubKey)) {
    throw new Error(
      "Invalid public key, supply a valid public key to check the balance of!"
    );
  }

  const address = pubKey;
  const balance = await connection.getBalance(address);
  const balanceInSol = balance / LAMPORTS_PER_SOL;

  console.log("Getting balance...");
  console.log(`The balance of the account at ${address} is ${balanceInSol}`);

  return balance;
}

/* let smith = new PublicKey("BgZz2aVnZbbWPrshVZnTbcmvcwt2VTNZu521qsGjRn6r");
checkBalance(smith); */

export default checkBalance;
