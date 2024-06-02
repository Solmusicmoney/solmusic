import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootStateType } from "../store";
import loadPlaylist from "@/lib/loadPlaylist";

export interface TrackType {
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail: string;
}

export interface PlaylistType {
  id: string;
  title: string;
  description: string;
  uploader: string;
  thumbnail: string;
  tracks: TrackType[];
}

export type PlaylistStateStatusType =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed";

export interface PlaylistStateType {
  data: PlaylistType | null;
  url: string;
  status: PlaylistStateStatusType;
  error: string | null;
}

const initialState: PlaylistStateType = {
  data: null,
  url: "https://music.youtube.com/playlist?list=OLAK5uy_kAPDTM-wp4LNhHc6_BdWoeUKuv3e50rjw&si=0i9IgzCUEU62chmr",
  status: "idle",
  error: null,
};

export const loadUserPlaylist = createAsyncThunk(
  "playlist/loadUserPlaylist",
  async (_, thunkAPI) => {
    const { playlist } = thunkAPI.getState() as RootStateType;
    return await loadPlaylist(playlist.url);
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setPlaylistUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<PlaylistType>) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    setStatus: (state, action: PayloadAction<PlaylistStateStatusType>) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserPlaylist.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loadUserPlaylist.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(loadUserPlaylist.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPlaylistUrl, setPlaylist, setStatus, setError } =
  playlistSlice.actions;

export default playlistSlice.reducer;
