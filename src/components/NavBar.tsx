import Image from "next/image";
import logo from "@/assets/logo.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Props = {};

const NavBar = (props: Props) => {
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
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
