import Image from "next/image";
import logo from "@/assets/logo.svg";
import { getSession, signOut, useSession } from "next-auth/react";

type Props = {};

const NavBar = (props: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="w-full">
        <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-4 ">
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
            {session && (
              <div>
                <button
                  className="px-8 py-3 bg-transparent rounded-full text-violet-700 outline-none outline-4 outline-zinc-300 transition-all duration-150 uppercase font-semibold tracking-widest"
                  onClick={() => signOut()}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
