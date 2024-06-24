import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootStateType } from "@/state/store";
import { createLiveStream, stopLive } from "@/state/livestream/livestreamSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";

const BroadcasterControls = () => {
  const [copiedToClipboard, setCopyToClipboard] = useState(false);
  const { joinRoom, leaveRoom, closeRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
  });

  const dispatch = useDispatch<DispatchType>();
  const livestreamState = useSelector(
    (state: RootStateType) => state.livestream
  );

  const { enableVideo, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio } = useLocalAudio();

  const copyBroadcastLink = async () => {
    let broadcastlink = `${process.env.NEXT_PUBLIC_DOMAIN}/streams/${livestreamState.broadcaster.roomId}`;
    await navigator.clipboard.writeText(broadcastlink);

    setCopyToClipboard(true);
    setTimeout(() => setCopyToClipboard(false), 3000);
  };

  const handleGoLive = async () => {
    try {
      const tokens = await dispatch(createLiveStream()).unwrap();

      if (tokens?.roomId && tokens.accessToken) {
        joinRoom({
          roomId: tokens.roomId,
          token: tokens.accessToken.token,
        });

        enableVideo(), enableAudio();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopLive = async () => {
    dispatch(stopLive());
    disableAudio(), disableVideo();
    leaveRoom();
    closeRoom();
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className={`text-white px-6 py-3 rounded font-medium bg-white bg-opacity-15 ${
          livestreamState.broadcaster.live ? "" : "hidden"
        }`}
        onClick={copyBroadcastLink}
      >
        {copiedToClipboard ? "Copied" : "Copy Livestream Link"}
      </button>
      <button
        onClick={
          livestreamState.broadcaster.live ? handleStopLive : handleGoLive
        }
        className={`px-6 flex items-center py-3 font-semibold rounded ${
          livestreamState.broadcaster.live
            ? "bg-red-200 text-red-600"
            : "bg-red-600 text-white"
        }`}
      >
        {livestreamState.broadcaster.live ? (
          <>
            <Icon icon="fluent:live-off-24-filled" className="text-2xl mr-2" />
            Stop Live
          </>
        ) : (
          <>
            <Icon icon="ri:live-fill" className="text-2xl mr-2" />
            Go Live
          </>
        )}
      </button>
    </div>
  );
};

export default BroadcasterControls;
