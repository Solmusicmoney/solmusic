import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createPeer, getPeerId } from "../lib/peer";

interface MusicControlContextProps {
  controlData: any;
  controlMusic: (data: any) => void;
  joinStream: (broadcasterId: string) => void;
  leaveStream: () => void;
  videoData: any;
  streamVideo: (data: any) => void;
}

const MusicControlContext = createContext<MusicControlContextProps | undefined>(
  undefined
);

export const MusicControlProvider = ({ children }: { children: ReactNode }) => {
  const [peer, setPeer] = useState<any>(null);
  const [controlData, setControlData] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [conn, setConn] = useState<any>(null);

  useEffect(() => {
    const newPeer = createPeer();
    setPeer(newPeer);

    newPeer.on("connection", (connection) => {
      connection.on("data", (data: any) => {
        if (data.type === "control_music") {
          setControlData(data.payload);
        }
        if (data.type === "video_stream") {
          setVideoData(data.payload);
        }
      });
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const controlMusic = (data: any) => {
    if (conn) {
      conn.send({ type: "control_music", payload: data });
    }
  };

  const joinStream = (broadcasterId: string) => {
    const connection = peer.connect(broadcasterId);
    connection.on("open", () => {
      setConn(connection);
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
    <MusicControlContext.Provider
      value={{
        controlData,
        controlMusic,
        joinStream,
        leaveStream,
        videoData,
        streamVideo,
      }}
    >
      {children}
    </MusicControlContext.Provider>
  );
};

export const useMusicControl = () => {
  const context = useContext(MusicControlContext);
  if (context === undefined) {
    throw new Error(
      "useMusicControl must be used within a MusicControlProvider"
    );
  }
  return context;
};
