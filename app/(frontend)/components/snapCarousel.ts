import gsap from "gsap";

export type SnapCarousel = {
  goTo: (index: number) => void;
  destroy: () => void;
};

type SnapCarouselOptions = {
  /** Scroll-snap container; its slides must use it as their offset parent. */
  track: HTMLElement;
  slides: HTMLElement[];
  /** Holds the `[data-carousel-*]` controls. */
  controls?: HTMLElement | null;
  reduced?: boolean;
  /** Fires as soon as a different slide becomes the nearest one. */
  onChange?: (index: number) => void;
  /** Fires once scrolling has come to rest. */
  onSettle?: (index: number) => void;
};

const SETTLE_FALLBACK_MS = 140;

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function bindSnapCarousel({
  track,
  slides,
  controls,
  reduced = false,
  onChange,
  onSettle,
}: SnapCarouselOptions): SnapCarousel {
  const count = slides.length;
  const prev = controls?.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const next = controls?.querySelector<HTMLButtonElement>("[data-carousel-next]");
  const counter = controls?.querySelector<HTMLElement>("[data-carousel-count]");
  const fill = controls?.querySelector<HTMLElement>("[data-carousel-fill]");

  let active = -1;
  let settled = -1;
  let frame = 0;
  let settleTimer = 0;

  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const startPad = () => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;

  const nearest = () => {
    const left = track.scrollLeft;
    if (left >= maxScroll() - 2) return count - 1;
    const anchor = left + startPad();
    let best = 0;
    let dist = Infinity;
    slides.forEach((slide, i) => {
      const d = Math.abs(slide.offsetLeft - anchor);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  const paint = () => {
    frame = 0;
    const max = maxScroll();
    const progress = max > 0 ? track.scrollLeft / max : 1;
    if (fill) {
      gsap.set(fill, { scaleX: (1 + progress * (count - 1)) / Math.max(1, count) });
    }

    const index = nearest();
    if (index === active) return;
    active = index;
    if (counter) counter.textContent = pad(index);
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= count - 1;
    slides.forEach((slide, i) => {
      slide.toggleAttribute("data-active", i === index);
    });
    onChange?.(index);
  };

  const settle = () => {
    window.clearTimeout(settleTimer);
    const index = nearest();
    if (index === settled) return;
    settled = index;
    onSettle?.(index);
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(paint);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, SETTLE_FALLBACK_MS);
  };

  const goTo = (index: number) => {
    const target = slides[gsap.utils.clamp(0, count - 1, index)];
    if (!target) return;
    track.scrollTo({
      left: Math.min(maxScroll(), target.offsetLeft - startPad()),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const step = (delta: number) => goTo(Math.max(active, 0) + delta);
  const onPrev = () => step(-1);
  const onNext = () => step(1);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const hadTabIndex = track.hasAttribute("tabindex");
  if (!hadTabIndex) track.tabIndex = 0;

  track.addEventListener("scroll", onScroll, { passive: true });
  track.addEventListener("scrollend", settle);
  track.addEventListener("keydown", onKey);
  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);

  paint();
  settled = active;

  return {
    goTo,
    destroy: () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", settle);
      track.removeEventListener("keydown", onKey);
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      if (!hadTabIndex) track.removeAttribute("tabindex");
      slides.forEach((slide) => slide.removeAttribute("data-active"));
      if (fill) gsap.set(fill, { clearProps: "transform" });
    },
  };
}
