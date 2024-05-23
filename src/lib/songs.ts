export const songUrl = (fileName: string) => {
  return encodeURI(process.env.NEXT_PUBLIC_MUSIC_STORE + fileName);
};
export const artCoverUrl = (fileName: string) => {
  return encodeURI(process.env.NEXT_PUBLIC_ALBUM_COVER_STORE + fileName);
};

let songs = [
  {
    title: "PICANTO (feat. Zlatan and ECko Miles)",
    artist: "ODUMODUBLVCK",
    url: songUrl("PICANTO (feat. Zlatan and ECko Miles).mp3"),
    album_cover: artCoverUrl("PICANTO (feat. Zlatan and ECko Miles).jpg"),
  },
  {
    title: "Calm Down (feat. Selena Gomez)",
    artist: "Rema",
    url: songUrl("Calm Down (feat. Selena Gomez).mp3"),
    album_cover: artCoverUrl("Calm Down (feat. Selena Gomez).jpg"),
  },
  {
    title: "Toast",
    artist: "Koffee",
    url: songUrl("Toast.weba"),
    album_cover: artCoverUrl("Toast.jpg"),
  },
  {
    title: "Mad Over You",
    artist: "Runtown",
    url: songUrl("Mad Over You.weba"),
    album_cover: artCoverUrl("Mad Over You.jpg"),
  },
  {
    title: "Water",
    artist: "Tyla",
    url: songUrl("Water.weba"),
    album_cover: artCoverUrl("Water.jpg"),
  },
  {
    title: "UNAVAILABLE (feat. Musa Keys)",
    artist: "Davido",
    url: songUrl("UNAVAILABLE (feat. Musa Keys).weba"),
    album_cover: artCoverUrl("UNAVAILABLE (feat. Musa Keys).jpg"),
  },
  {
    title: "Cast (feat. Odumodublvck)",
    artist: "Shallipopi",
    url: songUrl("Cast (feat. Odumodublvck).weba"),
    album_cover: artCoverUrl("Cast (feat. Odumodublvck).jpg"),
  },
  {
    title: "DOG EAT DOG II (feat. Cruel Santino & Bella Shmurda)",
    artist: "ODUMODUBLVCK",
    url: songUrl("DOG EAT DOG II (feat. Cruel Santino & Bella Shmurda).weba"),
    album_cover: artCoverUrl(
      "DOG EAT DOG II (feat. Cruel Santino & Bella Shmurda).jpg"
    ),
  },
  {
    title: "Peace Be Unto You (PBUY)",
    artist: "Asake",
    url: songUrl("Peace Be Unto You (PBUY).weba"),
    album_cover: artCoverUrl("Peace Be Unto You (PBUY).jpg"),
  },
  {
    title: "Happiness (feat. Asake & Gunna)",
    artist: "Sarz, Asake, & Gunna",
    url: songUrl("Happiness (feat. Asake & Gunna).weba"),
    album_cover: artCoverUrl("Happiness (feat. Asake & Gunna).jpg"),
  },
  {
    title: "Kpe Paso (feat. Olamide)",
    artist: "Wande Coal",
    url: songUrl("Kpe Paso (feat. Olamide).weba"),
    album_cover: artCoverUrl("Happiness (feat. Asake & Gunna).jpg"),
  },
  {
    title: "Reason You",
    artist: "Rema",
    url: songUrl("Reason You.weba"),
    album_cover: artCoverUrl("Reason You.jpg"),
  },
  {
    title: "Stubborn",
    artist: "Victony & Asake",
    url: songUrl("Stubborn.weba"),
    album_cover: artCoverUrl("Stubborn.jpg"),
  },
  {
    title: "I Don't Like You",
    artist: "Bloody Civilian",
    url: songUrl("I Don't Like You.weba"),
    album_cover: artCoverUrl("I Don't Like You.jpg"),
  },
  {
    title: "Abeg",
    artist: "DJ Neptune, Joeboy, & Omah Lay",
    url: songUrl("Abeg.weba"),
    album_cover: artCoverUrl("Abeg.jpg"),
  },
  {
    title: "My Darling",
    artist: "Victony",
    url: songUrl("My Darling.weba"),
    album_cover: artCoverUrl("My Darling.jpg"),
  },
  {
    title: "Bad Vibes (feat. Seyi Vibez)",
    artist: "Ayra Starr",
    url: songUrl("Bad Vibes (feat. Seyi Vibez).weba"),
    album_cover: artCoverUrl("Bad Vibes (feat. Seyi Vibez).jpg"),
  },
  {
    title: "Trouble Maker",
    artist: "Rema",
    url: songUrl("Trouble Maker.weba"),
    album_cover: artCoverUrl("Trouble Maker.jpg"),
  },
  {
    title: "Babylon (feat. Victony)",
    artist: "Patoranking",
    url: songUrl("Babylon (feat. Victony).weba"),
    album_cover: artCoverUrl("Babylon (feat. Victony).jpg"),
  },
  {
    title: "Tshwala Bam",
    artist: "Kabusa Oriental Choir",
    url: songUrl("Tshwala Bam.weba"),
    album_cover: artCoverUrl("Tshwala Bam.jpg"),
  },
];

export default songs;
