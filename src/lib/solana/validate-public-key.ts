import { PublicKey } from "@solana/web3.js";
import { sha256 } from "crypto-hash";

function isValidSolanaPublicKey(publicKeyStr: string | PublicKey): boolean {
  try {
    // Parse the public key string
    const publicKey = new PublicKey(publicKeyStr);

    // Check if the length is 32 bytes
    if (publicKey.toBuffer().length !== 32) {
      return false;
    }

    /* // Check if the public key has the correct encoding
        if (!publicKey.equals(await PublicKey.createWithSeed(Buffer.alloc(32), publicKey.toBuffer()))) {
            return false;
        } */

    /* // Check if the checksum is valid
    const keyBytes = publicKey.toBuffer();
    const checksumBytes = keyBytes.slice(-2); // Last 2 bytes are the checksum
    const keyData = keyBytes.slice(0, -2); // Remove the checksum bytes
    const calculatedChecksum = Buffer.from(sha256(await sha256(keyData))).slice(
      0,
      2
    ); // Calculate checksum
    if (!checksumBytes.equals(calculatedChecksum)) {
      return false;
    } */

    // If all checks pass, the public key is valid
    return true;
  } catch (error) {
    // If an error occurs during parsing, the public key is invalid
    return false;
  }
}

export { isValidSolanaPublicKey };
