import { PublicKey } from "@solana/web3.js";
import { connection } from "./connect-to-network";

async function checkAccountExistence(pubkey: PublicKey) {
  try {
    const accountInfo = await connection.getAccountInfo(pubkey);
    return !!accountInfo; // Returns true if account exists, false otherwise
  } catch (error) {
    console.error("Error checking account existence:", error);
    return false; // Return false in case of error
  }
}

export { checkAccountExistence };
