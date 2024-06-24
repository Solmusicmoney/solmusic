import { useEffect, useRef } from "react";
import {
  usePeerIds,
  useRemoteVideo,
  useRemoteAudio,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";

const ViewerCameraStream = () => {
  const { peerIds } = usePeerIds({ roles: [Role.HOST] }); // Get Hosts And Cohost's peerIds

  const { stream: remoteVideo, state: videoState } = useRemoteVideo({
    peerId: peerIds[0],
  });
  const { stream: remoteAudio, state: audioState } = useRemoteAudio({
    peerId: peerIds[0],
  });

  const vidRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log("stream", remoteVideo);
    if (remoteVideo && vidRef.current && videoState === "playable") {
      vidRef.current.srcObject = remoteVideo;

      vidRef.current.onloadedmetadata = async () => {
        try {
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [remoteVideo]);

  useEffect(() => {
    if (remoteAudio && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = remoteAudio;

      audioRef.current.onloadedmetadata = async () => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [remoteAudio]);

  return (
    <div className="-scale-x-100">
      <video
        ref={vidRef}
        autoPlay
        muted
        className="border-2 rounded-xl border-white-400 aspect-video"
      />
      <audio ref={audioRef} autoPlay></audio>
      {/*  {remoteVideo && <Video stream={remoteVideo} />}
      {remoteAudio && <Audio stream={remoteAudio} />} */}
    </div>
  );
};

export default ViewerCameraStream;
