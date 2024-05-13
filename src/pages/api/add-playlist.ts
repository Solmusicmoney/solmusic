import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { recs, prompt } = JSON.parse(req.body);

    if (!recs.length) {
      return res.status(500).json({ error: "Missing Tracks" });
    }

    try {
      let session = await getServerSession(req, res, authOptions);

      let spotifyId = session?.spotifyId;
      let accessToken = session?.accessToken;
      let baseEndpoint = "https://api.spotify.com/v1";

      let playlist = await (
        await fetch(`${baseEndpoint}/users/${spotifyId}/playlists`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: prompt,
          }),
        })
      ).json();

      let trackAdded = await (
        await fetch(`${baseEndpoint}/playlists/${playlist.id}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            uris: recs.map((rec: any) => rec.uri),
          }),
        })
      ).json();

      return res
        .status(200)
        .json({ playlistUrl: playlist.external_urls?.spotify });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
