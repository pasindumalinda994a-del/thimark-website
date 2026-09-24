export type HeroClip = {
  id: string;
  src: string;
  poster: string;
  label: string;
  alt: string;
};

export const HERO_CLIP_DURATION = 6;

/** Two source files, reused across the four reel stations. */
const HERO_VIDEOS = ["/vedios/0920.mp4", "/vedios/0920(1).mp4"] as const;

export const HERO_CLIPS: HeroClip[] = [
  {
    id: "precision",
    src: HERO_VIDEOS[0],
    poster: "/home-images/two-core-automotive.png",
    label: "Precision Components",
    alt: "Precision motorcycle components in production",
  },
  {
    id: "machinery",
    src: HERO_VIDEOS[1],
    poster: "/home-images/two-core-machinery.png",
    label: "Custom Machinery",
    alt: "Custom industrial machinery in the workshop",
  },
  {
    id: "fabrication",
    src: HERO_VIDEOS[0],
    poster: "/home-images/about-workshop.png",
    label: "Steel Fabrication",
    alt: "Steel fabrication in the Thimark workshop",
  },
  {
    id: "local",
    src: HERO_VIDEOS[1],
    poster: "/home-images/hero-bg.png",
    label: "Engineered Locally",
    alt: "Thimark engineering facility in Sri Lanka",
  },
];
