import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import NavBar from "./NavBar";
import { Icon } from "@iconify/react/dist/iconify.js";

import picantoImage from "@/assets/odumodublvck/picanto.jpg";
import calmdownImage from "@/assets/rema/calm down selena gomez.jpg";
import Image from "next/image";

import logo from "@/assets/logo.svg";

type PlayerProps = {
  ref: any;
  songs: any[];
  handleTick: () => void;
};

export type PlayerRef = {
  getPlayerRef: () => ReactPlayer | null;
};

function shuffleArray(array: any[]) {
  let shuffledArray = array.slice(); // Create a copy of the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get a random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

const MusicPlayer = forwardRef<PlayerRef, PlayerProps>(
  (props: PlayerProps, ref) => {
    const [playerState, setPlayerState] = useState({
      url: "",
      pip: false,
      playing: false,
      seeking: false,
      controls: false,
      light: false,
      volume: 0.8,
      muted: false,
      played: 0,
      playedSeconds: 0,
      loaded: 0,
      loadedSeconds: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      width: "100%",
      height: "100%",
    });
    const [tracks, setTracks] = useState(shuffleArray(props.songs));

    const [currentTrackIndex, setCurrTrackIndex] = useState(0);

    const [currentTrack, setCurrentTrack] = useState({
      url: "",
      album_cover: "",
      title: "",
      artist: "",
    });

    const playerRef = useRef<ReactPlayer>(null);

    useImperativeHandle(ref, () => ({
      getPlayerRef: () => playerRef.current,
    }));

    useEffect(() => {
      setCurrentTrack(tracks[currentTrackIndex]);
    }, []);

    useEffect(() => {
      setPlayerState({ ...playerState, url: currentTrack.url });
    }, [currentTrack]);

    useEffect(() => {
      setCurrentTrack(tracks[currentTrackIndex]);
    }, [currentTrackIndex]);

    const handleStop = () => {
      setPlayerState({ ...playerState, url: "", playing: false });
    };

    const handlePause = () => {
      setPlayerState({ ...playerState, playing: false });
    };

    const handlePlayPause = () => {
      setPlayerState({ ...playerState, playing: !playerState.playing });
    };

    const playNextTrack = () => {
      if (currentTrackIndex !== tracks.length - 1) {
        setCurrTrackIndex(currentTrackIndex + 1);
      } else {
        setCurrTrackIndex(0);
      }

      setPlayerState({ ...playerState, playing: true, played: 0, loaded: 0 });
    };

    const playPrevTrack = () => {
      if (currentTrackIndex !== 0) {
        setCurrTrackIndex(currentTrackIndex - 1);
      } else {
        setCurrTrackIndex(tracks.length - 1);
      }

      setPlayerState({ ...playerState, playing: true, played: 0, loaded: 0 });
    };

    const handleSeekMouseDown = (e: any) => {
      setPlayerState({
        ...playerState,
        seeking: true,
      });
    };

    const handleSeekChange = (e: any) => {
      setPlayerState({ ...playerState, played: parseFloat(e.target.value) });
    };

    const handleSeekMouseUp = (e: any) => {
      setPlayerState({
        ...playerState,
        seeking: false,
      });

      playerRef.current?.seekTo(parseFloat(e.target.value), "fraction");
    };

    const handleProgress = (state: any) => {
      console.log("onProgress", state);
      // We only want to update time slider if we are not currently seeking
      if (!playerState.seeking) {
        setPlayerState({ ...playerState, ...state });
      }

      props.handleTick();
    };

    const handleDuration = (duration: any) => {
      console.log("onDuration", duration);
      setPlayerState({ ...playerState, duration });
    };

    const handleEnded = () => {
      console.log("onEnded");
      playNextTrack();
    };

    return (
      <>
        {/* <div className="pt-12 px-3 flex justify-center">
          <Image
            src={logo}
            width={2000}
            height={2000}
            alt="Logo"
            className="w-32 h-auto ml-2"
          />
        </div> */}
        <div className="absolute top-0 left-0 w-full -z-50 h-[800px] overflow-hidden">
          <Image
            src={currentTrack.album_cover}
            alt="backdrop"
            width={2000}
            height={2000}
            id="backdrop"
            className="-z-50 absolute top-0 left-0 w-full"
          />
          <div></div>
        </div>
        {/* <NavBar /> */}
        <div className="w-full text-white">
          <div>
            <div className="hidden">
              <ReactPlayer
                ref={playerRef}
                {...playerState}
                onPause={handlePause}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onSeek={(e) => console.log("onSeek", e)}
                onEnded={handleEnded}
              />
            </div>
            <main
              id="profile-page"
              className="bg-slate-  animate__animated animate__fadeIn relative"
            >
              <section className="py-6 pb-8 flex w-full items-center justify-center">
                <div className="px-4  mx-auto w-full max-w-[330px] md:max-w-md sm:px-6 lg:px-8 flex flex-col">
                  {/* <div className="animate__animated animate__fadeInDown flex flex-col items-center">
                        <p className=" text-sm uppercase tracking-wide font-medium text-zinc-500 text-center">
                          Now playing
                        </p>
                        <div className="mt-5 flex gap-2 items-center mx-auto">
                          <p
                            className="block text-sm text-zinc-400"
                            id="currentTime"
                          >
                            -
                          </p>
                          <div className="h-2 w-32 bg-zinc-700">
                            <div
                              className="h-full bg-zinc-400"
                              id="progressBar"
                            ></div>
                          </div>
                          <p
                            className="block text-sm text-zinc-400"
                            id="duration"
                          >
                            -
                          </p>
                        </div>
                      </div> */}

                  <div>
                    <div
                      id="scrollTrigger"
                      className="w-64 h-64 mx-auto mb-8 relative flex flex-col gap-8 items-center justify-center"
                    >
                      <Image
                        src={currentTrack.album_cover}
                        width={2000}
                        height={2000}
                        alt={currentTrack.title}
                        className="absolute top-0 left-0 object-cover w-64 h-64 block mx-auto rounded-lg animate__animated animate__zoomIn"
                      />
                    </div>
                    <div className="animate__animated animate__fadeInUp">
                      <h2 className="text-2xl font-semibold text-center truncate">
                        {currentTrack.title}
                      </h2>
                      <p className=" text-zinc-400 text-lg text-center truncate mt-2">
                        {currentTrack.artist}
                      </p>
                      <div className="mt-6">
                        <input
                          type="range"
                          className="w-full"
                          min={0}
                          max={0.999999}
                          step="any"
                          value={playerState.played}
                          onMouseDown={handleSeekMouseDown}
                          onChange={handleSeekChange}
                          onMouseUp={handleSeekMouseUp}
                        />
                      </div>
                      <div className="flex gap-6 justify-center mt-6">
                        <button
                          className="play-button w-16 h-16 flex items-center justify-center animate__animated animate__slideInDown z-50"
                          onClick={playPrevTrack}
                        >
                          <Icon icon="bx:skip-previous" className="text-5xl" />
                        </button>
                        <button
                          className="play-button w-16 h-16 text-black bg-white rounded-full flex items-center justify-center animate__animated animate__slideInDown z-50"
                          onClick={handlePlayPause}
                        >
                          {playerState.playing ? (
                            <Icon icon="mdi:pause" className="text-5xl" />
                          ) : (
                            <Icon icon="mdi:play" className="text-5xl" />
                          )}
                        </button>
                        <button
                          className="play-button w-16 h-16 flex items-center justify-center animate__animated animate__slideInDown z-50"
                          onClick={playNextTrack}
                        >
                          <Icon icon="bx:skip-next" className="text-5xl" />
                        </button>
                      </div>
                      <div>
                        <td>
                          {/* <button onClick={handleClickFullscreen}>
                                Fullscreen
                              </button> */}
                          {/* {light && (
                                <button onClick={() => player.showPreview()}>
                                  Show preview
                                </button>
                              )} */}
                          {/*    {ReactPlayer.canEnablePIP(url) && (
                                <button onClick={handleTogglePIP}>
                                  {pip ? "Disable PiP" : "Enable PiP"}
                                </button>
                              )} */}
                        </td>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* <div
                  id="bottomPlayer"
                  className="mt-20 fixed bottom-0 w-full flex justify-center p-3 pb-8 animate__animated animate__fadeInUp"
                >
                  <div className="flex justify-between items-center bg-zinc-800 bg-opacity-90 rounded-xl p-3 max-w-lg w-full animtate__animated animate__slideInUp animate_delay-1s">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 flex flex-col gap-8 items-center">
                        <img
                          src={currentTrack.art_cover}
                          alt={currentTrack.title}
                          className=" object-cover w-16 h-16 block mx-auto rounded-lg border border-zinc-900"
                        />
                      </div>
                      <div>
                        <h2 className="text-md font-medium truncate w-48">
                          {currentTrack.title}
                        </h2>
                        <p className=" text-zinc-500 truncate">
                          {currentTrack.artist}
                        </p>
                      </div>
                    </div>
                    <button className="play-button w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-play  text-2xl ml-1"></i>
                    </button>
                  </div>
                </div> */}
            </main>
          </div>
        </div>
      </>
    );
  }
);

export default MusicPlayer;
