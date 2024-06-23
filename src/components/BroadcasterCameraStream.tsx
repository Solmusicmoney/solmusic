import { RootStateType } from "@/state/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLivestream } from "./LivestreamContext";
import {
  useLocalVideo,
  useLocalAudio,
  useLocalScreenShare,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";

const BroadcasterCameraStream: React.FC = () => {
  const { stream: videoStream } = useLocalVideo();
  const { stream: audioStream } = useLocalAudio();

  return (
    <div className="-scale-x-100">
      {videoStream && <Video stream={videoStream} />}
      {audioStream && <Audio stream={audioStream} />}
    </div>
  );
};

export default BroadcasterCameraStream;
