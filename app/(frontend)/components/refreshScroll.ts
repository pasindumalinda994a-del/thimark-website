import { ScrollTrigger } from "gsap/ScrollTrigger";

let frame = 0;

/** Coalesces refresh requests from components that mount together into one ScrollTrigger.refresh per frame. */
export function scheduleScrollRefresh() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    ScrollTrigger.refresh();
  });
}
