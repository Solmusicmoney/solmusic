import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccessToken,
  joinBroadcast,
  leaveBroadcast,
} from "@/state/livestream/livestreamSlice";
import { DispatchType, RootStateType } from "@/state/store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRoom } from "@huddle01/react/hooks";

type Props = {
  roomId: string | string[] | undefined;
};

const ViewerControls = ({ roomId }: Props) => {
  const dispatch = useDispatch<DispatchType>();
  const livestreamState = useSelector(
    (state: RootStateType) => state.livestream
  );

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });

  const handleJoinStream = async () => {
    let accessToken = await dispatch(
      getAccessToken({ roomId: roomId as string })
    ).unwrap();

    if (roomId && accessToken) {
      dispatch(
        joinBroadcast({
          streaming: true,
          roomId: roomId as string,
          accessToken: accessToken.token,
          status: "token-success",
          error: undefined,
        })
      );

      joinRoom({
        roomId: roomId as string,
        token: accessToken.token,
      });
    }
  };

  const handleLeaveStream = () => {
    dispatch(leaveBroadcast());
    leaveRoom();
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={
          livestreamState.viewer.streaming
            ? handleLeaveStream
            : handleJoinStream
        }
        className={`px-6  ${
          livestreamState.viewer.streaming
            ? "bg-purple-200 text-purple-600"
            : "bg-purple-600 text-white"
        } flex w-auto justify-center items-center py-3 font-semibold rounded`}
      >
        {livestreamState.broadcaster.live ? (
          <>
            <Icon
              icon="fluent:arrow-exit-20-filled"
              className="text-2xl mr-2"
            />
            Leave Stream
          </>
        ) : (
          <>
            <Icon
              icon="fluent:arrow-enter-16-filled"
              className="text-2xl mr-2"
            />
            Join Stream
          </>
        )}
      </button>
    </div>
  );
};

export default ViewerControls;
