import { createPeer } from "@/lib/peer";
import { RootStateType } from "@/state/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLivestream } from "./LivestreamContext";
import { joinBroadcast } from "@/state/livestream/livestreamSlice";
import {
  usePeerIds,
  useRemoteVideo,
  useRemoteAudio,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import { Video, Audio } from "@huddle01/react/components";

const ViewerCameraStream = () => {
  const { peerIds } = usePeerIds({ roles: [Role.HOST] }); // Get Hosts And Cohost's peerIds

  const { stream: remoteVideo } = useRemoteVideo({ peerId: peerIds[0] });
  const { stream: remoteAudio } = useRemoteAudio({ peerId: peerIds[0] });

  const { state, track, stream, isVideoOn } = useRemoteVideo({
    peerId: peerIds[0],
  });

  console.log(state);
  return (
    <div className="-scale-x-100">
      {remoteVideo && <Video stream={remoteVideo} />}
      {remoteAudio && <Audio stream={remoteAudio} />}
    </div>
  );
};

export default ViewerCameraStream;
