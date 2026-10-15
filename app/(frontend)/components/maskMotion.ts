const SPLIT_DURATION = 0.95;
const LINE_FADE_DURATION = 0.26;

/** Shared opener timing for the preload reveal and the page-transition mask. */
export const MASK_MOTION = {
  split: { duration: SPLIT_DURATION, ease: "power4.inOut" },
  fade: { duration: 0.3 },
  lineFade: {
    duration: LINE_FADE_DURATION,
    at: SPLIT_DURATION - LINE_FADE_DURATION,
  },
  seal: { duration: 0.12, ease: "power1.in" },
  unsealEase: "power1.out",
} as const;
