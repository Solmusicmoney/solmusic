import NavBar from "@/components/NavBar";
import Image from "next/image";
import googleLogo from "@/assets/google-logo.png";
import logo from "@/assets/mark.svg";
import mark from "@/assets/mark-yellow.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Disclaimer from "./Disclaimer";

const ConnectWallet = function () {
  return (
    <div className="flex flex-col h-screen mt-32">
      <div className=" px-4 flex justify-center items-center text-white">
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            <Image
              src={logo}
              width={500}
              height={500}
              className="w-14 h-auto ml-2"
              alt="Logo"
            />
          </div>
          <div>
            <h1 className=" text-3xl md:text-5xl font-bold capitalize max-w-2xl text-center">
              Millions of songs
            </h1>
            <h1 className=" text-3xl md:text-5xl font-bold capitalize max-w-2xl text-center mt-2">
              Earn while you listen
            </h1>
            <h1 className=" text-3xl md:text-5xl font-bold capitalize max-w-2xl text-center mt-2">
              All on Solmusic
            </h1>
          </div>

          <div className="flex justify-center">
            {/* <button
              className="px-8 py-3 rounded-full border-2 border-[#00F6AE] transition-all duration-150 uppercase font-semibold tracking-widest gap-2 text-[#00F6AE] hover:bg-[#00F6AE] hover:text-[#0d4232] focus:outline-[#00F6AE] justify-center "
              onClick={() => {}}
            >
              Connect Wallet
            </button> */}
            {/*  <button
              className="pl-5 pr-8 py-3 rounded-full outline-none outline-2 transition-all duration-150 capitalize font-semibold tracking-widest flex gap-3 items-center shadow-sm border-2 hover:bg-white hover:text-zinc-950 focus:outline-purple-600"
              onClick={() => signIn("google")}
            >
              <Image
                src={googleLogo}
                width={500}
                height={500}
                className="w-5 h-auto ml-2"
                alt="Google Logo"
              />
              <span>Sign in with Google</span>
            </button> */}
            <WalletMultiButton />
          </div>
          {/* <div className="mt-12 flex flex-col items-center">
            <p className="uppercase tracking-wider text-sm text-zinc-500 font-medium">
              Sign in reward
            </p>
            <div className="flex gap-3 mt-4">
              <Image
                src={mark}
                width={500}
                height={500}
                className="w-4 h-auto ml-2"
                alt="token image"
              />
              <p className="text-xl">
                <span className="dm-mono-regular tracking-wider">1,000</span>
                <span className="uppercase tracking-wider text-sm text-zinc-500 font-medium">
                  {" "}
                  SOLM
                </span>
              </p>
            </div>
          </div> */}
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};

export default ConnectWallet;
