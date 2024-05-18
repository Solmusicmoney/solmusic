import { Cluster, Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(
  clusterApiUrl(process.env.NEXT_PUBLIC_CLUSTER as Cluster)
);

console.log("Connection created!");

export { connection };
