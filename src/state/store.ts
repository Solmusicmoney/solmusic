import { configureStore } from "@reduxjs/toolkit";
import playlistSlice from "./playlist/playlistSlice";
import playerSlice from "./player/playerSlice";
import mintSlice from "./mint/mintSlice";
import livestreamSlice from "./livestream/livestreamSlice";

export const store = configureStore({
  reducer: {
    playlist: playlistSlice,
    player: playerSlice,
    mint: mintSlice,
    livestream: livestreamSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootStateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
