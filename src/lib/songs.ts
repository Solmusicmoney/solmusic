const songUrl = (fileName: string) => {
  return encodeURI(process.env.NEXT_PUBLIC_MUSIC_STORE + fileName);
};
const artCoverUrl = (fileName: string) => {
  return encodeURI(process.env.NEXT_PUBLIC_ART_COVER_STORE + fileName);
};

const songs = [
  {
    url: songUrl("PICANTO.mp3"),
    art_cover: artCoverUrl("picanto.jpg"),
    title: "PICANTO (feat. Zlatan and ECko Miles)",
    artist: "ODUMODUBLVCK",
  },
  {
    url: songUrl("Rema, Selena Gomez - Calm Down.mp3"),
    art_cover: artCoverUrl("calm down selena gomez.jpg"),
    title: "Calm Down (feat. Selena Gomez)",
    artist: "Rema",
  },
];

export default songs;
