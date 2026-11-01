export type NewsVideo = {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  blurb: string;
};

/** Sample clips — swap `youtubeId` for Thimark channel uploads when ready. */
export const NEWS_VIDEOS: NewsVideo[] = [
  {
    id: "kilgharrah-brief",
    title: "KILGHARRAH 600 — project brief",
    date: "2025-09-12",
    youtubeId: "aqz-KE-bpKQ",
    blurb: "How the trash rack cleaner for KenGen moved from shop floor to site.",
  },
  {
    id: "shop-floor",
    title: "Fabrication on the floor",
    date: "2025-06-18",
    youtubeId: "M7lc1UVf-VE",
    blurb: "Weld, machine, and assemble — a short look through the works.",
  },
  {
    id: "export-dispatch",
    title: "Export dispatch, Port of Colombo",
    date: "2025-04-03",
    youtubeId: "LXb3EKWsInQ",
    blurb: "Crated, sealed, and leaving Sri Lanka for an overseas hydropower site.",
  },
  {
    id: "sltc-awards",
    title: "SLTC innovation awards",
    date: "2024-11-22",
    youtubeId: "jNQXAC9IVRw",
    blurb: "Recognition for engineering work built and proven at home.",
  },
  {
    id: "gate-commission",
    title: "Sluice gate commission",
    date: "2024-08-09",
    youtubeId: "C0DPdy98e4c",
    blurb: "First water through a custom gate after installation and dry runs.",
  },
];

export function youtubeThumb(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeEmbed(youtubeId: string) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
}

export function formatVideoDate(iso: string) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ] as const;
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}
