import Image from "next/image";
import logo from "@/assets/logo.svg";
import { getSession, signOut, useSession } from "next-auth/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Props = {};

const NavBar = (props: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="w-full">
        <div className="px-4 pt-8 pb-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <a
                href="/"
                className="flex md:mr-24 font-semibold text-2xl text-white"
              >
                <Image
                  src={logo}
                  width={2000}
                  height={2000}
                  alt="Logo"
                  className="w-32 h-auto ml-2"
                />
              </a>
            </div>
            <div className="flex gap-6 items-center">
              <WalletMultiButton />
              {/* {session && (
                <div className="hidden md:block">
                  <button
                    className="px-8 py-3 rounded-full outline-none outline-2 transition-all duration-150 capitalize font-semibold tracking-widest flex gap-3 items-center shadow-sm text-white border-2 hover:bg-white hover:text-zinc-950 focus:outline-purple-600"
                    onClick={() => signOut()}
                  >
                    Log out
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
