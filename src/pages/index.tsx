import MusicPlayer, { PlayerRef } from "@/components/MusicPlayer";
import { NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

// artist data. Refactor

const Home: NextPage = function () {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<PlayerRef>(null);

  setTimeout(() => console.log("ref", ref.current?.getPlayerRef()), 2000);

  return (
    <>
      <MusicPlayer ref={ref} />
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
  return { props: {} };
}

export default Home;
