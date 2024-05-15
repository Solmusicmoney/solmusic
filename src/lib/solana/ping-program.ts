import {
  AccountMeta,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { connection } from "./connect-to-network";
import { keypair } from "./load-env-keypair";

type TransactionInstructionCtorFields = {
  keys: Array<AccountMeta>;
  programId: PublicKey;
  data?: Buffer;
};

async function ping() {
  const pingProgramId = new PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
  ); // Public address of the program
  const pingProgramDataId = new PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
  );
  const payer = keypair;
  const transaction = new Transaction();

  const pingInstruction = new TransactionInstruction({
    keys: [
      {
        pubkey: pingProgramDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: pingProgramId,
  });

  transaction.add(pingInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);

  console.log("Ping Transaction complete!");
  console.log(
    `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  return signature;
}

export { ping };
