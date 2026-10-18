export type HeroVideo = {
  webm?: string;
  mp4: string;
};

export type HeroClip = {
  id: string;
  src: HeroVideo | null;
  poster: string;
  label: string;
  detail: string;
  alt: string;
};

export const HERO_CLIP_DURATION = 6;

/** One source file per reel station (public Vercel Blob). */
const HERO_VIDEOS = [
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-1.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-2.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-3.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-4.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-5.mp4" },
] as const satisfies readonly HeroVideo[];

export const HERO_CLIPS: HeroClip[] = [
  {
    id: "quality",
    src: HERO_VIDEOS[0],
    poster: "/pages/home/two-core-automotive.png",
    label: "Quality",
    detail: "Commitment to producing high quality well engineered components",
    alt: "Precision motorcycle components in production",
  },
  {
    id: "delivery",
    src: HERO_VIDEOS[1],
    poster: "/pages/home/two-core-machinery.png",
    label: "Timely Delivery",
    detail: "Ensuring products are delivered on time",
    alt: "Custom industrial machinery in the workshop",
  },
  {
    id: "reliability",
    src: HERO_VIDEOS[2],
    poster: "/pages/home/about-workshop.png",
    label: "Reliability",
    detail: "Providing dependable and consistent service",
    alt: "Steel fabrication in the Thimark workshop",
  },
  {
    id: "service",
    src: HERO_VIDEOS[3],
    poster: "/pages/home/hero-bg.png",
    label: "Professional Service",
    detail: "Offering worry free, professional service to clients",
    alt: "Thimark engineering facility in Sri Lanka",
  },
  {
    id: "ethics",
    src: HERO_VIDEOS[4],
    poster: "/pages/home/about-iso-precision.jpeg",
    label: "Business Ethics and Integrity",
    detail: "Upholding ethical conduct and strong moral principles",
    alt: "Engineers inspecting a precision-machined gear assembly",
  },
];
