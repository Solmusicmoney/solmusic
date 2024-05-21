import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

type Props = {
  progress: number;
};
function Miner({ progress }: Props) {
  useEffect(() => {
    const max = 60;

    const percentage = (progress / max) * 100;

    const progressBar = document.getElementById("loader");
    progressBar!.style.width = `${percentage}%`;
  }, [progress]);

  return (
    <div className="bg-zinc-800 bg-opacity-30 w-full sm:w-80 p-4 px-6 rounded-md">
      <div className="flex gap-1 items-center text-white justify-center">
        <Icon icon="ph:gear-light" className="text-2xl" />
        <span className="tracking-wider">Miner</span>
      </div>
      <div className="h-5 w-full my-5 bg-zinc-700 rounded overflow-hidden animate__animated animate__fadeIn">
        <div id="loader" className="h-full w-1/2 bg-zinc-400"></div>
      </div>
      <p className="text-center text-sm text-zinc-400 mt-3">
        2 SOLM per minute listening to music
      </p>
    </div>
  );
}

export default Miner;
