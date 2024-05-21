import { clusterApiUrl, Cluster } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { keypair as loadedKeyPair } from "./load-env-keypair";
import { mint } from "./load-env-mint";

const uploadMetadataForToken = async (offChainMetadata: any) => {
  const umi = createUmi(
    clusterApiUrl(process.env.NEXT_PUBLIC_CLUSTER as Cluster)
  );
  const web3jsKeyPair = loadedKeyPair; // load your keypair here

  const keypair = fromWeb3JsKeypair(web3jsKeyPair);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  let CreateMetadataAccountV3Args = {
    //accounts
    mint: fromWeb3JsPublicKey(mint),
    mintAuthority: signer,
    payer: signer,
    updateAuthority: fromWeb3JsKeypair(web3jsKeyPair).publicKey,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: offChainMetadata.uri, // uri of uploaded metadata
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  };

  let instruction = createMetadataAccountV3(umi, CreateMetadataAccountV3Args);

  const transaction = await instruction.buildAndSign(umi);

  const transactionSignature = await umi.rpc.sendTransaction(transaction);
  const signature = base58.deserialize(transactionSignature);

  console.log({ signature });

  return signature;
};
/* 
(async () => {
  const offChainMetadata = {
    name: "Solmusic",
    symbol: "SOLM",
    description: "Millions of Songs, Earn while you listen, All on Solmusic",
    uri: "https://arweave.net/hoR8u88CapiUHGeC0r4prBtPMVl36dQCsWCFSVIbrgg",
  };
  await uploadMetadataForToken(offChainMetadata);
})(); */

export { uploadMetadataForToken };
