import Container from "@/components/Container";
import NavBar from "@/components/NavBar";
import { NextPage, NextPageContext } from "next";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import spotifyLogo from "@/assets/spotify-logo.png";

interface Props {
  playlists: string;
}

const PlaylistEmpty = function () {
  return (
    <div className="flex text-center justify-center items-center h-full">
      <h1 className=" text-3xl md:text-5xl font-bold leading-tight text-zinc-600">
        Your new playlist will appear here
      </h1>
    </div>
  );
};
const PlaylistFull = function ({
  recs,
  prompt,
}: {
  recs: any[];
  prompt: string;
}) {
  const navigate = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState(undefined);

  const createPlaylist = async () => {
    if (playlistUrl) {
      // navigate to url
      window.open(playlistUrl, "_blank");
    } else {
      try {
        // hit endpoint and return playlist's url
        let { playlistUrl } = await (
          await fetch("/api/add-playlist", {
            method: "POST",
            body: JSON.stringify({
              recs,
              prompt,
            }),
          })
        ).json();

        setPlaylistUrl(playlistUrl);
        // navigate to url
        window.open(playlistUrl, "_blank");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-zinc-600 capitalize">
          Your playlist
        </h1>
        <button
          className="px-8 py-3 bg-white rounded-full text-zinc-800 outline-none outline-2 transition-all duration-150 uppercase font-semibold tracking-widest flex gap-2 items-center shadow-sm border hover:outline-[#1dd661] w-max mb-8 md:mb-0"
          onClick={createPlaylist}
        >
          <span>Play on</span>
          <Image
            src={spotifyLogo}
            width={500}
            height={500}
            alt="Spotify Logo"
            className="w-28"
          />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {recs.map((track: any, ii: number) => {
          return (
            <div key={ii} className="flex gap-4 items-center">
              <span className="w-6 h-3 flex justify-center items-center text-zinc-500 font-mono text-lg">
                {ii + 1}
              </span>
              <img src={track.albumArt} alt={track.name} className="w-14" />
              <div>
                <h4 className="text-white text-lg truncate">{track.name}</h4>
                <p className="text-zinc-400">{track.artists.join(", ")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Create = function () {
  const [prompt, setPrompt] = useState("");

  const [recs, setRecs] = useState([]);

  const generatePlaylist = async () => {
    if (!prompt) {
      console.log("nah");
    } else {
      console.log("ya");
      try {
        const { recs } = await (
          await fetch("/api/gpt-recs", {
            method: "POST",
            body: JSON.stringify({
              prompt,
            }),
          })
        ).json();

        const response = await fetch("/api/playlist", {
          method: "POST",
          body: JSON.stringify({
            recs,
          }),
        });

        if (response.status == 200) {
          const { recs } = await response.json();
          setRecs(recs);
        } else if (response.status == 401) {
          const { error } = await response.json();
          signOut({ callbackUrl: "/sign-in" });
          throw error;
        } else {
          const { error } = await response.json();
          throw error;
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <NavBar />
      <main className=" min-h-screen">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col gap-8 lg:w-2/3">
              <h1 className="text-3xl md:text-5xl max-w-xl font-bold capitalize leading-tight">
                Create the perfect Playlist with AI
              </h1>
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className=" font-semibold text-zinc-700">
                    Describe the kind of mood you want
                  </label>
                  <textarea
                    placeholder="Eg: Make me an afrobeat playlist for my party tonight..."
                    className="px-3 py-3 bg-zinc-300 rounded-lg h-32 placeholder:text-zinc-500 outline-none focus:outline-2 focus:outline-violet-700 transition-all duration-150"
                    required={true}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-col gap-4 justify-center ">
                <button
                  className="px-3 py-3 bg-violet-700 hover:bg-violet-800 rounded-full text-white outline-none focus:outline-2 focus:outline-violet-700 transition-all duration-150 uppercase font-semibold tracking-widest"
                  onClick={() => generatePlaylist()}
                >
                  Generate playlist
                </button>
              </div>
            </div>
            <div className="w-full min-h-max bg-[#201D24] rounded-2xl px-8 py-10 lg:-mt-10">
              {recs.length ? (
                <PlaylistFull recs={recs} prompt={prompt} />
              ) : (
                <PlaylistEmpty />
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default Create;
