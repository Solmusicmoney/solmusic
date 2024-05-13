require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log("Keypair loaded!");
console.log("Public key: ", keypair.publicKey.toBase58());

export { keypair };
