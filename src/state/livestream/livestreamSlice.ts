import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { trackProgress } from "../player/playerSlice";
import { Connection, PublicKey } from "@solana/web3.js";
import { RootStateType } from "../store";
import { mint as mintAddress } from "@/lib/solana/load-env-mint";
import { useConnection } from "@solana/wallet-adapter-react";
import { connection } from "@/lib/solana/connect-to-network";

export interface LivestreamStateType {
  broadcaster: {
    live: boolean;
    peerId: string | undefined;
    roomId: string | undefined;
    accessToken: string | undefined;
    status:
      | "idle"
      | "room-loading"
      | "room-success"
      | "room-failed"
      | "token-loading"
      | "token-success"
      | "token-failed";
    error: string | undefined;
  };
  viewer: {
    streaming: boolean;
    roomId: string | undefined;
    accessToken: string | undefined;
    status: "idle" | "token-loading" | "token-success" | "token-failed";
    error: string | undefined;
  };
}

const initialState: LivestreamStateType = {
  broadcaster: {
    live: false,
    peerId: undefined,
    roomId: undefined,
    accessToken: undefined,
    status: "idle",
    error: undefined,
  },
  viewer: {
    streaming: false,
    roomId: undefined,
    accessToken: undefined,
    status: "idle",
    error: undefined,
  },
};

export const createRoom = createAsyncThunk(
  "livestream/create-room",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    // check if a room exists in local storage and create a new room if it doesn't
    let roomId = localStorage.getItem("prev_room_id");

    if (roomId) {
      return roomId;
    } else {
      try {
        let response = await fetch("/api/streams/create-room", {
          method: "POST",
          body: JSON.stringify({
            roomName: "Huddle01 meet",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return thunkAPI.rejectWithValue(errorData || "An error occurred");
        } else {
          const data = await response.json();
          roomId = data.data.roomId;

          localStorage.setItem("prev_room_id", roomId!);
        }
      } catch (err) {
        return thunkAPI.rejectWithValue(JSON.stringify(err));
      }
    }
  }
);

type tokenProps = {
  roomId: string;
};
export const getAccessToken = createAsyncThunk(
  "livestream/get-access-token",
  async ({ roomId }: tokenProps, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    if (!roomId) {
      console.log("reach");
      return thunkAPI.rejectWithValue("No room to access");
    }

    try {
      let response = await fetch(
        `/api/streams/get-access-token?roomId=${roomId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
);

export const createLiveStream = createAsyncThunk(
  "livestream/create-live-stream",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    try {
      let roomId = await thunkAPI.dispatch(createRoom()).unwrap();
      let accessToken = await thunkAPI
        .dispatch(getAccessToken({ roomId: roomId as string }))
        .unwrap();

      return { roomId, accessToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(JSON.stringify(error));
    }
  }
);

export const livestreamSlice = createSlice({
  name: "livestream",
  initialState,
  reducers: {
    stopLive: (state) => {
      state.broadcaster = {
        live: false,
        peerId: undefined,
        roomId: undefined,
        accessToken: undefined,
        status: "idle",
        error: undefined,
      };
    },
    joinBroadcast: (
      state,
      action: PayloadAction<LivestreamStateType["viewer"]>
    ) => {
      state.viewer = {
        streaming: action.payload.streaming,
        roomId: action.payload.roomId,
        accessToken: action.payload.accessToken,
        status: action.payload.status,
        error: action.payload.error,
      };
    },
    leaveBroadcast: (state) => {
      state.viewer = {
        streaming: false,
        roomId: undefined,
        accessToken: undefined,
        status: "idle",
        error: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state, action) => {
        state.broadcaster.status = "room-loading";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.broadcaster.status = "room-success";
        state.broadcaster.roomId = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.broadcaster.status = "room-failed";
        state.broadcaster.error = action.error.message;
      })
      .addCase(getAccessToken.pending, (state, action) => {
        state.broadcaster.status = "token-loading";
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.broadcaster.status = "token-success";
        state.broadcaster.accessToken = action.payload.accessToken;
        state.broadcaster.live = true;
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.broadcaster.status = "token-failed";
        state.broadcaster.error = action.error.message;
      });
  },
});

export const { joinBroadcast, leaveBroadcast, stopLive } =
  livestreamSlice.actions;

export default livestreamSlice.reducer;
