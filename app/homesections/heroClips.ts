export type HeroClip = {
  id: string;
  src: string;
  poster: string;
  label: string;
  detail: string;
  alt: string;
};

export const HERO_CLIP_DURATION = 6;

/** Two source files, reused across the five reel stations. */
const HERO_VIDEOS = ["/vedios/0920.mp4", "/vedios/0920(1).mp4"] as const;

export const HERO_CLIPS: HeroClip[] = [
  {
    id: "quality",
    src: HERO_VIDEOS[0],
    poster: "/home-images/two-core-automotive.png",
    label: "Quality",
    detail: "Commitment to producing high quality well engineered components",
    alt: "Precision motorcycle components in production",
  },
  {
    id: "delivery",
    src: HERO_VIDEOS[1],
    poster: "/home-images/two-core-machinery.png",
    label: "Timely Delivery",
    detail: "Ensuring products are delivered on time",
    alt: "Custom industrial machinery in the workshop",
  },
  {
    id: "reliability",
    src: HERO_VIDEOS[0],
    poster: "/home-images/about-workshop.png",
    label: "Reliability",
    detail: "Providing dependable and consistent service",
    alt: "Steel fabrication in the Thimark workshop",
  },
  {
    id: "service",
    src: HERO_VIDEOS[1],
    poster: "/home-images/hero-bg.png",
    label: "Professional Service",
    detail: "Offering worry free, professional service to clients",
    alt: "Thimark engineering facility in Sri Lanka",
  },
  {
    id: "ethics",
    src: HERO_VIDEOS[0],
    poster: "/home-images/about-iso-precision.jpeg",
    label: "Business Ethics and Integrity",
    detail: "Upholding ethical conduct and strong moral principles",
    alt: "Engineers inspecting a precision-machined gear assembly",
  },
];
