import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootStateType } from "../store";
import loadPlaylist from "@/lib/loadPlaylist";
import { shuffleArray } from "@/components/MusicPlayer";
import { useDispatch } from "react-redux";

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
  url: string | undefined;
  status: PlaylistStateStatusType;
  error: string | null;
}

const initialState: PlaylistStateType = {
  data: null,
  url: undefined,
  status: "idle",
  error: null,
};

export const loadUserPlaylist = createAsyncThunk(
  "playlist/loadUserPlaylist",
  async (_, thunkAPI) => {
    const { playlist } = thunkAPI.getState() as RootStateType;

    let user_playlist = localStorage.getItem("user_playlist");
    if (user_playlist) {
      // set playlist url to the on in user-playlist
      localStorage.setItem("user_playlist", user_playlist);
      return await loadPlaylist(user_playlist);
    } else {
      localStorage.setItem(
        "user_playlist",
        process.env.NEXT_PUBLIC_DEFAULT_PLAYLIST!
      );
      return await loadPlaylist(localStorage.getItem("user_playlist")!);
    }
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
        state.data.tracks = shuffleArray(state.data.tracks);
        state.url = localStorage.getItem("user_playlist")!;
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
