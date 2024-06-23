import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createPeer, getPeerId } from "../lib/peer";
import Peer from "peerjs";

interface LivestreamContextProps {
  controlData: any;
  controlMusic: (data: any) => void;
  joinStream: (broadcasterId: string) => void;
  leaveStream: () => void;
  streamVideo: (data: any) => void;
  getStream: (id: string) => MediaStream | undefined;
  addStream: (id: string, stream: MediaStream) => void;
}

const LivestreamContext = createContext<LivestreamContextProps | undefined>(
  undefined
);

export const LivestreamProvider = ({ children }: { children: ReactNode }) => {
  const [peer, setPeer] = useState<Peer>();
  const [controlData, setControlData] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [conn, setConn] = useState<any>(null);
  const [streams, setStreams] = useState<{ id: string; stream: MediaStream }[]>(
    []
  );

  const addStream = (id: string, stream: MediaStream) => {
    setStreams((prevStreams) => [...prevStreams, { id, stream }]);
  };

  const getStream = (id: string) => {
    let streamObj = streams.find((val) => val.id == id);

    return streamObj?.stream;
  };

  const controlMusic = (data: any) => {
    if (conn) {
      conn.send({ type: "control_music", payload: data });
    }
  };

  const joinStream = (broadcasterId: string) => {
    const peer = createPeer();
    setPeer(peer);

    const connection = peer.connect(broadcasterId);

    connection.on("open", () => {
      setConn(connection);
      console.log("joined");
    });

    connection.on("data", (data: any) => {
      if (data.type === "control_music") {
        setControlData(data.payload);
      }
      if (data.type === "video_stream") {
        setVideoData(data.payload);
      }
    });
  };

  const leaveStream = () => {
    if (conn) {
      conn.close();
      setConn(null);
    }
  };

  const streamVideo = (data: any) => {
    if (conn) {
      conn.send({ type: "video_stream", payload: data });
    }
  };

  return (
    <LivestreamContext.Provider
      value={{
        controlData,
        controlMusic,
        joinStream,
        leaveStream,
        streamVideo,
        getStream,
        addStream,
      }}
    >
      {children}
    </LivestreamContext.Provider>
  );
};

export const useLivestream = () => {
  const context = useContext(LivestreamContext);
  if (context === undefined) {
    throw new Error("useLivestream must be used within a LivestreamProvider");
  }
  return context;
};
