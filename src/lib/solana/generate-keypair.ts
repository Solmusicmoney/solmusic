import { Keypair } from "@solana/web3.js";

async function createKeypair() {
  const keypair = Keypair.generate();

  console.log("Keypair generated!");
  console.log("Public key: ", keypair.publicKey.toBase58());

  return keypair;
}

export default createKeypair;
