import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let { roomName } = JSON.parse(req.body);

    try {
      const response = await fetch(
        "https://api.huddle01.com/api/v1/create-room",
        {
          method: "POST",
          body: JSON.stringify({
            title: roomName,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.HUDDLE01_API_KEY as string,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      } else {
        const data = await response.json();
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
