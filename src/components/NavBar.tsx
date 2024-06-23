import Image from "next/image";
import logo from "@/assets/logo.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { RootStateType } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import BroadcasterControls from "./BroadcasterControls";
import ViewerControls from "./ViewerControls";

type Props = {
  roomId?: string | string[] | undefined;
};

const NavBar = (props: Props) => {
  return (
    <>
      <nav className="w-full">
        <div className="px-4 pt-8 pb-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-4 ">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex  items-center justify-start">
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
            <div className="flex flex-col sm:flex-row mt-6 sm:mt-0 gap-6 items-center">
              {!props.roomId && <BroadcasterControls />}
              {props.roomId && <ViewerControls roomId={props.roomId} />}
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
