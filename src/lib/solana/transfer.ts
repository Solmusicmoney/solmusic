import {
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { keypair } from "./load-env-keypair";
import { connection } from "./connect-to-network";
import { checkAccountExistence } from "./check-account-existence";
import { createNewAccount } from "./create-account";

async function transfer(pubkey: PublicKey, lamports: number) {
  if (!pubkey) {
    throw new Error(`Please provide a public key to send to`);
  }

  const senderKeypair = keypair;

  // check if receipient account exists, if it doesn't create a new one
  if (!(await checkAccountExistence(pubkey))) {
    throw new Error(
      `Theres no account associated with this public key: ${pubkey}`
    );
  }

  console.log(`Receipient's public key: ${pubkey}`);

  const recentBlockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    blockhash: recentBlockhash.blockhash,
    lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  });

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: pubkey,
    lamports,
  });

  transaction.add(sendSolInstruction);

  console.log(`Instruction added to send ${lamports} lamports to ${pubkey}`);

  transaction.sign(keypair);

  console.log(`Transaction signed by authority`);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);

  console.log(
    `💸 Finished! Sent ${lamports} lamports to the address ${pubkey}.`
  );

  console.log(`Transaction signature is ${signature}!`);
  console.log(
    `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

// Example (runs from cli)
/* (async () => {
  let smith = new PublicKey("BgZz2aVnZbbWPrshVZnTbcmvcwt2VTNZu521qsGjRn6r");
  transfer(smith, 1500000);
})(); */

export default transfer;
