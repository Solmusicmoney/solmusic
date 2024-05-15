require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Keypair } from "@solana/web3.js";

//const keypair = getKeypairFromEnvironment("SECRET_KEY");
const secretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY ?? ""));
const keypair = Keypair.fromSecretKey(secretKey);

console.log("Keypair loaded!");
console.log("Public key: ", keypair.publicKey.toBase58());

export { keypair };
