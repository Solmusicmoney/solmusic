/* // This uses "@metaplex-foundation/mpl-token-metadata@2" to create token
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { connection } from "./connect-to-network";
import { keypair } from "./load-env-keypair";
import { mint } from "./load-env-mint";

async function createTokenMetadata() {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  // Subtitute in your token mint account
  const tokenMintAccount = new PublicKey(mint);

  const metadataData = {
    name: "Solmusic",
    symbol: "SOLM",
    // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
    uri: "https://arweave.net/1234",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction();

  const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMintAccount,
        mintAuthority: keypair.publicKey,
        payer: keypair.publicKey,
        updateAuthority: keypair.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      }
    );

  transaction.add(createMetadataAccountInstruction);

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );

  const transactionLink = `https://explorer.solana.com/address/${transactionSignature}?cluster=${process.env.NEXT_PUBLIC_CLUSTER}`;

  console.log(
    `✅ Transaction confirmed, explorer link is: ${transactionLink}!`
  );

  const tokenMintLink = `https://explorer.solana.com/address/${tokenMintAccount.toString()}?cluster=${
    process.env.NEXT_PUBLIC_CLUSTER
  }`;

  console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);

  return transactionSignature;
}
 */
