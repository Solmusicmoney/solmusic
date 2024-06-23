import Peer from "peerjs";

let peer: Peer;
let myPeerId: string;

export const createPeer = () => {
  if (!peer) {
    peer = new Peer({
      host: "/",
      port: 9000,
    });

    peer.on("open", (id) => {
      myPeerId = id;
      console.log("My peer ID is: " + myPeerId);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });
  }

  return peer;
};

export const getPeerId = () => myPeerId;
