import React from "react";
import Image from "next/image";
import bkydLogoMark from "@/assets/bkyd/mark.svg";

function Disclaimer() {
  return (
    <div className="px-4 mt-3 flex flex-col gap-5 items-center">
      <p className="text-zinc-300 text-sm mb-3 mx-auto max-w-md text-center">
        This is just an experimental demo, running on Solana Testnet. No real
        funds is being distributed until we launch.
      </p>
      <div className="flex flex-col justify-center">
        <p className="text-zinc-300 text-sm text-center mb-3">
          Built with love & music by
        </p>
        <a
          href="https://bkyd.studio"
          target="_blank"
          className="flex font-medium text-white"
        >
          <Image
            src={bkydLogoMark}
            width={2000}
            height={2000}
            alt="Logo"
            className="w-12 h-auto"
          />
          <span className="ml-3">Backyard Studios</span>
        </a>
      </div>
    </div>
  );
}

export default Disclaimer;
