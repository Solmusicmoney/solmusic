import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt } = JSON.parse(req.body);

    if (!prompt) {
      return res.status(500).json({ error: "Missing Prompt" });
    }

    try {
      let session = await getServerSession(req, res, authOptions);

      session && console.log("Session True");

      // generate settings
      let system = `
      You have very good taste in music.

      Generate a list of as many songs that follow the mood and theme in the user's prompt.
      
      Output the songs in an array taking this shape:
      [
        {
          name: "name-of-track",
          artists: ["array-of-artists"],
        },
      ];
      `;

      let user = prompt;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      let gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: user,
          },
        ],
        temperature: 0,
        max_tokens: 600,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // find song matches on spotify
      let songs = JSON.parse(gptResponse.choices[0].message.content as string);

      return res.status(200).json({ recs: songs });
    } catch (error: any) {
      console.log("error", error);
      return res.status(error.status ?? 500).json({ error: error });
    }
  }
}
