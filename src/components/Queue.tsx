import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { RootStateType } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack } from "@/state/player/playerSlice";
import { shuffleArray } from "./MusicPlayer";

type Props = {};
function Queue({}: Props) {
  const { data } = useSelector((state: RootStateType) => state.playlist);
  const playlist = data;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-white text-2xl font-semibold mb-3">Up Next</h3>
      <div className="bg-zinc-800 bg-opacity-30 w-full py-7 px-6 rounded-md  h-[500px] overflow-y-auto">
        <div className="flex flex-col">
          {playlist?.tracks.length &&
            playlist.tracks.map((track, ii) => (
              <div
                onClick={() =>
                  dispatch(setCurrentTrack({ track: track, index: ii }))
                }
                className="flex gap-4 items-center hover:cursor-pointer hover:bg-zinc-800 p-3 -mx-3 rounded-2xl"
              >
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  className=" object-cover w-16 h-16 block rounded-md"
                  width={500}
                  height={500}
                />
                <div className="w-48">
                  <h2 className="text-md text-white text-lg font-medium truncate">
                    {track.title}
                  </h2>
                  <p className=" text-zinc-400 truncate">{track.artist}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Queue;
