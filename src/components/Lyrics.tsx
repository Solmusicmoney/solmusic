import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { RootStateType } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack } from "@/state/player/playerSlice";

type Props = {};
function Lyrics({}: Props) {
  const { data } = useSelector((state: RootStateType) => state.playlist);
  const playlist = data;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-white text-2xl font-semibold mb-3">Lyrics</h3>
      <div className="bg-zinc-800 bg-opacity-30 w-full py-7 px-6 rounded-md  h-[500px] overflow-y-auto flex justify-center items-center">
        <h3 className="text-zinc-600 text-2xl font-semibold mb-3">
          Coming Soon
        </h3>
      </div>
    </div>
  );
}

export default Lyrics;
