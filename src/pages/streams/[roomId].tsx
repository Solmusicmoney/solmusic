import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import TokenMint from "@/components/TokenMint";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenBalance from "@/components/TokenBalance";
import Disclaimer from "@/components/Disclaimer";
import ConnectWallet from "@/components/ConnectWallet";
import BonkBalance from "@/components/BonkBalance";
import ViewerCameraStream from "@/components/ViewerCameraStream";
import { useRouter } from "next/router";

const Stream = function () {
  const [loaded, setLoaded] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const router = useRouter();
  const { roomId } = router.query; // Access the dynamic parameter

  return (
    <div className="pb-10">
      {loaded && (
        <>
          {connected ? (
            <div>
              <NavBar roomId={roomId} />
              <div className="flex flex-col md:flex-row justify-center px-4 pb-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-4 ">
                <div className="md:max-h-[500px] h-[400px] mt-5 rounded-md overflow-hidden md:w-6/12 bg-black">
                  <ViewerCameraStream />
                </div>
              </div>
              <div className="flex flex-col mt-6 items-center sm:flex-row gap-6 sm:justify-center mb-16 px-4">
                <TokenMint />
                <TokenBalance />
                <BonkBalance />
              </div>
              <Disclaimer />
            </div>
          ) : (
            <ConnectWallet />
          )}
        </>
      )}
    </div>
  );
};

export default Stream;
