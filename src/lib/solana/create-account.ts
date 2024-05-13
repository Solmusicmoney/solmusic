import {
  SystemProgram,
  Keypair,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { keypair } from "./load-env-keypair";
import { connection } from "./connect-to-network";

async function createNewAccount() {
  const newAccount = new Keypair(); // Create a new account object

  const recentBlockhash = await connection.getLatestBlockhash();
  const space = 0;
  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(space);

  const transaction = new Transaction({
    blockhash: recentBlockhash.blockhash,
    lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  }).add(
    SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: rentExemptionAmount,
      space,
      programId: new PublicKey(SystemProgram.programId),
    })
  );

  // Sign and send the transaction
  transaction.sign(keypair);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair,
    newAccount,
  ]);

  console.log("New account created:", newAccount.publicKey.toBase58());
  console.log(`Transaction signature is ${signature}!`);

  return { newAccount, signature };
}

export { createNewAccount };
