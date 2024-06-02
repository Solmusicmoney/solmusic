import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import loadPlaylist from "@/lib/loadPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootStateType } from "@/state/store";
import {
  loadUserPlaylist,
  setPlaylistUrl,
} from "@/state/playlist/playlistSlice";

function Playlist() {
  const { data, url, status } = useSelector(
    (state: RootStateType) => state.playlist
  );
  const playlist = data;
  const dispatch = useDispatch<DispatchType>();

  const handleLoadPlaylist = async function () {
    dispatch(loadUserPlaylist());
  };

  useEffect(() => {
    if (status == "idle") {
      dispatch(loadUserPlaylist());
    }
  }, [dispatch]);

  /*  const handleSetCurrentPlaylist = async function () {
    dispatch(loadUserPlaylist());
  }; */

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-white text-2xl font-semibold mb-3">Playlists</h3>
      <div className="bg-zinc-800 bg-opacity-30 w-full py-7 px-6 rounded-md  h-[500px] overflow-y-auto">
        <div className="mb-6">
          <p className=" text-md font-semibold text-white mb-3">
            Import from Youtube Music
          </p>
          <input
            type="text"
            className="px-4 py-2 bg-zinc-950 text-white w-full rounded-lg"
            placeholder="Paste playlist or album link from Youtube"
            value={url}
            onChange={(e) => dispatch(setPlaylistUrl(e.target.value))}
          />
          <button
            onClick={handleLoadPlaylist}
            className="w-full p-2 bg-purple-500 text-white mt-3 rounded-lg"
          >
            Import
          </button>
        </div>
        <div className="flex flex-col mt-6">
          <div
            /*  onClick={() => handleSetCurrentPlaylist(playlist)} */
            className="flex gap-4 items-center hover:cursor-pointer hover:bg-zinc-800 p-3 -mx-3 rounded-2xl"
          >
            <Image
              src={playlist?.thumbnail!}
              alt={playlist?.title!}
              className=" object-cover w-16 h-16 block rounded-md"
              width={500}
              height={500}
            />
            <div className="w-48">
              <h2 className="text-md text-white text-lg font-medium truncate">
                {playlist?.title}
              </h2>
              <p className=" text-zinc-400 truncate">
                {playlist?.tracks?.length} Songs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
