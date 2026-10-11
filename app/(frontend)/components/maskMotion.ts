const SPLIT_DURATION = 0.78;
const LINE_FADE_DURATION = 0.22;

/** Shared opener timing for the preload reveal and the page-transition mask. */
export const MASK_MOTION = {
  split: { duration: SPLIT_DURATION, ease: "power4.inOut" },
  fade: { duration: 0.25 },
  lineFade: {
    duration: LINE_FADE_DURATION,
    at: SPLIT_DURATION - LINE_FADE_DURATION,
  },
  seal: { duration: 0.08, ease: "power1.in" },
  unsealEase: "power1.out",
} as const;
