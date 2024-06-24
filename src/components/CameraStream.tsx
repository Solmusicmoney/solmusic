import { RootStateType } from "@/state/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const CameraStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const livestreamState = useSelector(
    (state: RootStateType) => state.livestream
  );

  useEffect(() => {
    const startVideo = async () => {
      // show stream
      if (videoRef.current) {
        videoRef.current.srcObject = livestreamState.broadcaster.stream;
      }
    };

    startVideo();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CameraStream;
