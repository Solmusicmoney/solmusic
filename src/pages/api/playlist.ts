import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { recs } = JSON.parse(req.body);

    if (!recs?.length) {
      return res.status(500).json({ error: "Missing Recs" });
    }

    try {
      let session = await getServerSession(req, res, authOptions);

      const findSong = async (name: string, artists: any[]) => {
        let querystring = `track:${name} artist:${artists.join(
          ", "
        )}&type=track&limit=1`;
        let searchEndpoint = `https://api.spotify.com/v1/search?q=${encodeURI(
          querystring
        )}`;

        let response = await fetch(searchEndpoint, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        /* const jso = {
          tracks: {
            href: "https://api.spotify.com/v1/search?query=track%3Adumebi+artist%3Arema&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=0&limit=1",
            limit: 1,
            next: "https://api.spotify.com/v1/search?query=track%3Adumebi+artist%3Arema&type=track&locale=en-US%2Cen%3Bq%3D0.9&offset=1&limit=1",
            offset: 0,
            previous: null,
            total: 10,
            items: [
              {
                album: {
                  album_type: "album",
                  total_tracks: 10,
                  available_markets: [
                    "AO",
                    "BF",
                    "BI",
                    "BJ",
                    "BW",
                    "CD",
                    "CG",
                    "CI",
                    "CM",
                    "CV",
                    "DJ",
                    "ET",
                    "GA",
                    "GH",
                    "GM",
                    "GN",
                    "GQ",
                    "GW",
                    "KE",
                    "KM",
                    "LR",
                    "LS",
                    "MG",
                    "ML",
                    "MR",
                    "MU",
                    "MW",
                    "MZ",
                    "NA",
                    "NE",
                    "NG",
                    "RW",
                    "SC",
                    "SL",
                    "SN",
                    "ST",
                    "SZ",
                    "TD",
                    "TG",
                    "TZ",
                    "UG",
                    "ZA",
                    "ZM",
                    "ZW",
                  ],
                  external_urls: {
                    spotify:
                      "https://open.spotify.com/album/5H6TAMOUgLUX1RfSOG1Al5",
                  },
                  href: "https://api.spotify.com/v1/albums/5H6TAMOUgLUX1RfSOG1Al5",
                  id: "5H6TAMOUgLUX1RfSOG1Al5",
                  images: [
                    {
                      url: "https://i.scdn.co/image/ab67616d0000b273ddb0147ae01ec66fa591f68d",
                      height: 640,
                      width: 640,
                    },
                    {
                      url: "https://i.scdn.co/image/ab67616d00001e02ddb0147ae01ec66fa591f68d",
                      height: 300,
                      width: 300,
                    },
                    {
                      url: "https://i.scdn.co/image/ab67616d00004851ddb0147ae01ec66fa591f68d",
                      height: 64,
                      width: 64,
                    },
                  ],
                  name: "Rema Compilation",
                  release_date: "2020-07-10",
                  release_date_precision: "day",
                  type: "album",
                  uri: "spotify:album:5H6TAMOUgLUX1RfSOG1Al5",
                  artists: [
                    {
                      external_urls: {
                        spotify:
                          "https://open.spotify.com/artist/46pWGuE3dSwY3bMMXGBvVS",
                      },
                      href: "https://api.spotify.com/v1/artists/46pWGuE3dSwY3bMMXGBvVS",
                      id: "46pWGuE3dSwY3bMMXGBvVS",
                      name: "Rema",
                      type: "artist",
                      uri: "spotify:artist:46pWGuE3dSwY3bMMXGBvVS",
                    },
                  ],
                },
                artists: [
                  {
                    external_urls: {
                      spotify:
                        "https://open.spotify.com/artist/46pWGuE3dSwY3bMMXGBvVS",
                    },
                    href: "https://api.spotify.com/v1/artists/46pWGuE3dSwY3bMMXGBvVS",
                    id: "46pWGuE3dSwY3bMMXGBvVS",
                    name: "Rema",
                    type: "artist",
                    uri: "spotify:artist:46pWGuE3dSwY3bMMXGBvVS",
                  },
                ],
                available_markets: [
                  "AO",
                  "BF",
                  "BI",
                  "BJ",
                  "BW",
                  "CD",
                  "CG",
                  "CI",
                  "CM",
                  "CV",
                  "DJ",
                  "ET",
                  "GA",
                  "GH",
                  "GM",
                  "GN",
                  "GQ",
                  "GW",
                  "KE",
                  "KM",
                  "LR",
                  "LS",
                  "MG",
                  "ML",
                  "MR",
                  "MU",
                  "MW",
                  "MZ",
                  "NA",
                  "NE",
                  "NG",
                  "RW",
                  "SC",
                  "SL",
                  "SN",
                  "ST",
                  "SZ",
                  "TD",
                  "TG",
                  "TZ",
                  "UG",
                  "ZA",
                  "ZM",
                  "ZW",
                ],
                disc_number: 1,
                duration_ms: 179775,
                explicit: false,
                external_ids: {
                  isrc: "NGA3B1914003",
                },
                external_urls: {
                  spotify:
                    "https://open.spotify.com/track/6CJD4LDNULzE645JA2XHpx",
                },
                href: "https://api.spotify.com/v1/tracks/6CJD4LDNULzE645JA2XHpx",
                id: "6CJD4LDNULzE645JA2XHpx",
                name: "Dumebi",
                popularity: 54,
                preview_url:
                  "https://p.scdn.co/mp3-preview/55734438508642c275373aca870410b3e9a514a4?cid=2aebdb5aa56f4a7ea8da3cccbb8da5c8",
                track_number: 4,
                type: "track",
                uri: "spotify:track:6CJD4LDNULzE645JA2XHpx",
                is_local: false,
              },
            ],
          },
        }; */

        if (response.status == 200) {
          let data = await response.json();

          if (data.tracks.items.length) {
            let track = {
              name: data.tracks.items[0].name,
              artists: data.tracks.items[0].artists.map(
                (artist: any, ii: any) => artist.name
              ),
              uri: data.tracks.items[0].uri,
              albumArt: data.tracks.items[0].album.images[2].url,
            };

            return track;
          } else {
            return;
          }
        } else {
          const { error } = await response.json();
          console.log(error);
          throw error;
        }
      };

      let spotifyTracks = [];

      for await (const song of recs) {
        let foundTrack = await findSong(song.name, song.artists);
        if (foundTrack) spotifyTracks.push(foundTrack);
      }

      console.log("Spotify Tracks: ", spotifyTracks);

      return res.status(200).json({ recs: spotifyTracks });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
