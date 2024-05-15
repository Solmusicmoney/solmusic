import MusicPlayer, { PlayerRef } from "@/components/MusicPlayer";
import { NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import songs from "@/lib/songs";
import { ping } from "@/lib/solana/ping-program";

const Home: NextPage = function () {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<PlayerRef>(null);

  setTimeout(() => console.log("ref", ref.current?.getPlayerRef()), 2000);

  return (
    <>
      <MusicPlayer ref={ref} songs={songs} />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  /* const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  } */
  ping();
  return { props: {} };
}

export default Home;
