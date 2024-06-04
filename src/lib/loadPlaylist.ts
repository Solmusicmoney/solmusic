import { PlaylistType } from "@/state/playlist/playlistSlice";

const loadPlaylist = async function (url: string): Promise<PlaylistType> {
  let response = await fetch(process.env.NEXT_PUBLIC_PLAYLIST!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export default loadPlaylist;
