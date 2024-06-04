import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseReactPlayerProps, OnProgressProps } from "react-player/base";
import {
  PlaylistType,
  TrackType,
  loadUserPlaylist,
} from "../playlist/playlistSlice";

import trackPlaceholder from "@/assets/track-thumbnail-placeholder.png";

export interface PlayerStateType {
  reactPlayer: BaseReactPlayerProps;
  currentTrack: TrackType;
  trackIndex: number;
}

const initialState: PlayerStateType = {
  reactPlayer: {
    url: "",
    pip: false,
    playing: false,
    seeking: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    width: "100%",
    height: "100%",
  },
  currentTrack: {
    title: "Loading Title...",
    artist: "Loading Artist...",
    duration: 0,
    url: "",
    thumbnail: trackPlaceholder.src,
  },
  trackIndex: 0,
};

type setCurrentTrackType = {
  track: TrackType;
  index: number;
};

export type trackProgressType = {
  playerProgress: OnProgressProps;
  playing: boolean | undefined;
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<setCurrentTrackType>) => {
      state.reactPlayer.url = action.payload.track.url;
      state.currentTrack = action.payload.track;
      state.trackIndex = action.payload.index;
    },
    pause: (state) => {
      state.reactPlayer.playing = false;
    },
    playPause: (state) => {
      state.reactPlayer.playing = !state.reactPlayer.playing;
    },
    playNextTrack: (state, action: PayloadAction<PlaylistType>) => {
      const { tracks } = action.payload;
      let newTrackIndex: number;

      if (state.trackIndex !== tracks.length - 1) {
        newTrackIndex = state.trackIndex + 1;
        state.currentTrack = tracks[newTrackIndex];
      } else {
        newTrackIndex = 0;
        state.currentTrack = tracks[newTrackIndex];
      }

      state.trackIndex = newTrackIndex;
      state.reactPlayer = {
        ...state.reactPlayer,
        url: state.currentTrack.url,
        playing: true,
        played: 0,
        loaded: 0,
      };
    },
    playPrevTrack: (state, action: PayloadAction<PlaylistType>) => {
      const { tracks } = action.payload;
      let newTrackIndex;

      if (state.trackIndex !== 0) {
        newTrackIndex = state.trackIndex - 1;
        state.currentTrack = tracks[newTrackIndex];
      } else {
        newTrackIndex = tracks.length - 1;
        state.currentTrack = tracks[newTrackIndex];
      }
      state.trackIndex = newTrackIndex;
      state.reactPlayer = {
        ...state.reactPlayer,
        url: state.currentTrack.url,
        playing: true,
        played: 0,
        loaded: 0,
      };
    },
    seekMouseDown: (state) => {
      state.reactPlayer.seeking = true;
    },
    seekChange: (state, action: PayloadAction<string>) => {
      state.reactPlayer = {
        ...state.reactPlayer,
        played: parseFloat(action.payload),
      };
    },
    seekMouseUp: (state) => {
      state.reactPlayer.seeking = false;
    },
    trackProgress: (state, action: PayloadAction<trackProgressType>) => {
      if (!state.reactPlayer.seeking) {
        state.reactPlayer = {
          ...state.reactPlayer,
          ...action.payload.playerProgress,
        };
      }
    },
    trackDuration: (state, action: PayloadAction<TrackType["duration"]>) => {
      state.reactPlayer = {
        ...state.reactPlayer,
        duration: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserPlaylist.fulfilled, (state, action) => {
      const track = action.payload.tracks[0];
      state.reactPlayer.url = track.url;
      state.currentTrack = track;
      state.trackIndex = 0;
    });
  },
});

export const {
  setCurrentTrack,
  pause,
  playPause,
  playNextTrack,
  playPrevTrack,
  seekMouseDown,
  seekChange,
  seekMouseUp,
  trackProgress,
  trackDuration,
} = playerSlice.actions;

export default playerSlice.reducer;
