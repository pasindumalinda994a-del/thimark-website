"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { preload } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  HERO_CLIP_DURATION,
  HERO_CLIPS,
  type HeroVideo,
} from "@/app/(frontend)/homesections/heroClips";

gsap.registerPlugin(useGSAP);

const CROSSFADE = 0.6;
const CAPTION_SHIFT = 8;

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function prefersPosterOnly() {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  const type = connection.effectiveType;
  return type === "slow-2g" || type === "2g";
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StationPlus() {
  return (
    <svg
      aria-hidden
      width={7}
      height={7}
      viewBox="0 0 7 7"
      fill="none"
      className="hero-reel-plus size-[7px] shrink-0"
    >
      <line
        x1="0"
        y1="3.5"
        x2="7"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <line
        x1="3.5"
        y1="0"
        x2="3.5"
        y2="7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ClipPoster({ src, priority }: { src: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes="100vw"
      className="object-cover"
    />
  );
}

export default function HeroReel() {
  preload(HERO_CLIPS[0].poster, { as: "image", fetchPriority: "high" });

  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const fillsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const postersRef = useRef<(HTMLDivElement | null)[]>([]);
  const goToRef = useRef<(index: number) => void>(() => {});
  const beginVideoRef = useRef<() => void>(() => {});
  const sourcesArmedRef = useRef(false);
  const skipCaption = useRef(true);
  const [active, setActive] = useState(0);
  const [videoEnabled] = useState(() => !prefersPosterOnly());
  /** Sources stay unmounted until the site preloader finishes so Blob video cannot race boot. */
  const [sourcesArmed, setSourcesArmed] = useState(false);

  useEffect(() => {
    if (!sourcesArmed) return;
    sourcesArmedRef.current = true;
    beginVideoRef.current();
  }, [sourcesArmed]);

  useGSAP(
    () => {
      const el = captionRef.current;
      if (!el) return;
      if (skipCaption.current) {
        skipCaption.current = false;
        return;
      }
      // Hover already revealed this label; replaying the fade would flicker.
      if (el.closest("li")?.matches(":hover")) return;
      gsap.fromTo(
        el,
        { x: CAPTION_SHIFT, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    },
    { dependencies: [active] },
  );

  useGSAP((context, contextSafe) => {
    if (!contextSafe) return;

    const layers = layersRef.current;
    const fills = fillsRef.current;
    if (HERO_CLIPS.some((_, i) => !layers[i] || !fills[i])) return;

    gsap.set(layers[0], { autoAlpha: 1 });
    gsap.set(layers.slice(1), { autoAlpha: 0 });
    gsap.set(fills, { "--fill": 0 });
    postersRef.current.forEach((poster) => {
      if (poster) gsap.set(poster, { autoAlpha: 1 });
    });

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    const posterOnly = !videoEnabled;
    let visible = true;
    let pageHidden = document.hidden;
    let behindPreloader =
      document.documentElement.dataset.preloaded !== "true" &&
      document.querySelector("[data-preloader]") !== null;
    /** Preloader finished — video network is allowed (sources may still be mounting). */
    let networkAllowed = false;
    let progressTween: gsap.core.Tween | undefined;
    let detachMedia: (() => void) | undefined;
    const activeIndex = { n: 0 };
    let goTo: (index: number) => void = () => {};

    const clipSrc = (index: number): HeroVideo | null => {
      if (posterOnly || reduced) return null;
      return HERO_CLIPS[index]?.src ?? null;
    };

    const canRun = () => visible && !pageHidden && !reduced && !behindPreloader;

    const setFills = (index: number, currentScale: number) => {
      fills.forEach((fill, i) => {
        if (!fill) return;
        if (i < index) gsap.set(fill, { "--fill": 1 });
        else if (i === index) gsap.set(fill, { "--fill": currentScale });
        else gsap.set(fill, { "--fill": 0 });
      });
    };

    const showPoster = (index: number) => {
      const poster = postersRef.current[index];
      if (poster) gsap.set(poster, { autoAlpha: 1 });
    };

    const hidePoster = (index: number) => {
      const poster = postersRef.current[index];
      if (poster) gsap.to(poster, { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
    };

    const stopClip = () => {
      progressTween?.kill();
      progressTween = undefined;
      detachMedia?.();
      detachMedia = undefined;
      videosRef.current.forEach((video) => {
        video?.pause();
      });
    };

    const startTimer = (index: number) => {
      const fill = fills[index];
      if (!fill) return;
      showPoster(index);
      progressTween?.kill();
      progressTween = gsap.fromTo(
        fill,
        { "--fill": 0 },
        {
          "--fill": 1,
          duration: HERO_CLIP_DURATION,
          ease: "none",
          onComplete: () => goTo(index + 1),
        },
      );
    };

    const preloadAround = (index: number) => {
      if (!networkAllowed || !sourcesArmedRef.current || posterOnly) return;
      const next = (index + 1) % HERO_CLIPS.length;
      videosRef.current.forEach((video, i) => {
        if (!video || !clipSrc(i)) return;
        const shouldLoad = i === index || i === next;
        video.preload = shouldLoad ? "auto" : "none";
        if (shouldLoad && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.load();
        }
      });
    };

    const startProgress = (index: number) => {
      const fill = fills[index];
      const video = videosRef.current[index];
      const src = clipSrc(index);

      setFills(index, 0);
      showPoster(index);
      if (!canRun() || !fill) return;

      if (src && video && networkAllowed && sourcesArmedRef.current) {
        preloadAround(index);

        const onTimeUpdate = () => {
          const duration = video.duration;
          if (!duration || !Number.isFinite(duration)) return;
          gsap.set(fill, { "--fill": video.currentTime / duration });
        };
        const onEnded = () => {
          goTo(index + 1);
        };
        const onPlaying = () => {
          if (activeIndex.n === index) hidePoster(index);
        };
        const onCanPlay = () => {
          if (activeIndex.n !== index || !canRun()) return;
          void video.play().catch(() => {
            if (activeIndex.n !== index) return;
            detachMedia?.();
            detachMedia = undefined;
            startTimer(index);
          });
        };

        detachMedia = () => {
          video.removeEventListener("timeupdate", onTimeUpdate);
          video.removeEventListener("ended", onEnded);
          video.removeEventListener("playing", onPlaying);
          video.removeEventListener("canplay", onCanPlay);
        };

        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("ended", onEnded);
        video.addEventListener("playing", onPlaying);
        video.addEventListener("canplay", onCanPlay);

        try {
          video.currentTime = 0;
        } catch {
          // Seeking before metadata is ready can throw; load() handles it.
        }

        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          onCanPlay();
        } else {
          video.load();
        }
        return;
      }

      startTimer(index);
    };

    const beginVideo = () => {
      if (!networkAllowed || reduced || posterOnly) return;
      stopClip();
      preloadAround(activeIndex.n);
      if (canRun()) startProgress(activeIndex.n);
    };
    beginVideoRef.current = beginVideo;

    /** Allow video network and mount <source> tags; playback starts after sources commit. */
    const armNetwork = () => {
      behindPreloader = false;
      networkAllowed = true;
      if (sourcesArmedRef.current) {
        beginVideo();
        return;
      }
      setSourcesArmed(true);
    };

    goTo = contextSafe((index: number) => {
      const next =
        ((index % HERO_CLIPS.length) + HERO_CLIPS.length) % HERO_CLIPS.length;
      const prev = activeIndex.n;
      const same = next === prev;
      const prevLayer = layers[prev];
      const nextLayer = layers[next];

      stopClip();
      if (networkAllowed && sourcesArmedRef.current) preloadAround(next);

      if (!same && prevLayer && nextLayer) {
        gsap.to(prevLayer, {
          autoAlpha: 0,
          duration: reduced ? 0 : CROSSFADE,
          ease: "power2.inOut",
          overwrite: "auto",
        });
        gsap.to(nextLayer, {
          autoAlpha: 1,
          duration: reduced ? 0 : CROSSFADE,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }

      activeIndex.n = next;
      setActive(next);

      if (reduced) {
        setFills(next, 1);
        showPoster(next);
        return;
      }

      startProgress(next);
    });

    goToRef.current = goTo;

    const pausePlayback = () => {
      progressTween?.pause();
      videosRef.current[activeIndex.n]?.pause();
    };

    const resumePlayback = () => {
      if (!canRun()) return;
      if (progressTween) {
        progressTween.resume();
        return;
      }
      const video = videosRef.current[activeIndex.n];
      if (clipSrc(activeIndex.n) && video && networkAllowed && sourcesArmedRef.current) {
        void video.play().catch(() => {});
        return;
      }
      startProgress(activeIndex.n);
    };

    const syncMotion = () => {
      reduced = reducedQuery.matches;
      if (reduced) {
        stopClip();
        gsap.set(layers, { autoAlpha: 0 });
        gsap.set(layers[activeIndex.n], { autoAlpha: 1 });
        setFills(activeIndex.n, 1);
        showPoster(activeIndex.n);
        return;
      }
      if (canRun()) resumePlayback();
    };

    const onVisibility = () => {
      pageHidden = document.hidden;
      if (pageHidden) pausePlayback();
      else resumePlayback();
    };

    const onPreloadDone = () => {
      if (!behindPreloader) return;
      armNetwork();
    };
    window.addEventListener("thimark:preload-done", onPreloadDone);

    if (reduced) {
      setFills(0, 1);
    } else if (!behindPreloader) {
      armNetwork();
    } else {
      // Poster-only timer while the site preloader owns the network.
      startProgress(0);
    }

    const media = mediaRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) resumePlayback();
        else pausePlayback();
      },
      { threshold: 0.2 },
    );
    if (media) observer.observe(media);

    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", syncMotion);

    return () => {
      observer.disconnect();
      window.removeEventListener("thimark:preload-done", onPreloadDone);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", syncMotion);
      beginVideoRef.current = () => {};
      stopClip();
    };
  });

  return (
    <>
      <div ref={mediaRef} className="hero-reel-media">
        {HERO_CLIPS.map((item, index) => {
          const useVideo = Boolean(item.src) && videoEnabled;

          return (
            <div
              key={item.id}
              ref={(node) => {
                layersRef.current[index] = node;
              }}
              className={`absolute inset-0 ${index === 0 ? "opacity-100" : "opacity-0"}`}
            >
              {useVideo && item.src ? (
                <>
                  <video
                    ref={(node) => {
                      videosRef.current[index] = node;
                    }}
                    muted
                    playsInline
                    preload="none"
                    aria-label={item.alt}
                    className="h-full w-full object-cover"
                  >
                    {sourcesArmed ? (
                      <>
                        {item.src.webm ? (
                          <source src={item.src.webm} type="video/webm" />
                        ) : null}
                        <source src={item.src.mp4} type="video/mp4" />
                      </>
                    ) : null}
                  </video>
                  <div
                    ref={(node) => {
                      postersRef.current[index] = node;
                    }}
                    className="absolute inset-0"
                  >
                    <ClipPoster src={item.poster} priority={index === 0} />
                  </div>
                </>
              ) : (
                <div
                  ref={(node) => {
                    postersRef.current[index] = node;
                  }}
                  className="absolute inset-0"
                >
                  <ClipPoster src={item.poster} priority={index === 0} />
                </div>
              )}
            </div>
          );
        })}
        <div className="hero-reel-veil" aria-hidden />
      </div>

      <div className="hero-reel-scrim" aria-hidden />
      <div className="hero-reel-meta">
        <ol className="hero-reel-tracks" aria-label="Company values">
          {HERO_CLIPS.map((item, index) => {
            const isActive = index === active;

            return (
              <li
                key={item.id}
                className="hero-reel-station relative flex min-h-0 flex-1 flex-col"
              >
                <button
                  type="button"
                  aria-label={`Show clip ${padIndex(index)}: ${item.label}. ${item.detail}`}
                  aria-current={isActive}
                  className="flex h-full min-h-0 flex-1 flex-col text-left"
                  onClick={() => goToRef.current(index)}
                >
                  <span
                    className={`hero-reel-readout font-heading text-[12px] leading-none font-medium uppercase ${
                      isActive ? "text-cream" : "text-cream/70"
                    }`}
                  >
                    <StationPlus />
                    <span aria-hidden className="hero-reel-leader" />
                    <span className="tabular-nums">{padIndex(index)}</span>
                    {isActive ? (
                      <span
                        ref={captionRef}
                        aria-live="polite"
                        className="hero-reel-label min-w-0"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <span aria-hidden className="hero-reel-label hero-reel-peek">
                        {item.label}
                      </span>
                    )}
                  </span>
                  <span className="hero-reel-rail">
                    <span className="hero-reel-track relative h-full w-[1.5px] overflow-hidden bg-cream/50">
                      <span
                        ref={(node) => {
                          fillsRef.current[index] = node;
                        }}
                        className="hero-reel-fill absolute inset-0 bg-cream"
                      />
                    </span>
                  </span>
                </button>
                <span aria-hidden className="hero-reel-detail font-heading">
                  <span className="hero-reel-detail-copy">
                    {item.detail.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="hero-reel-word"
                        style={{ "--i": wordIndex } as CSSProperties}
                      >
                        <span>{word}</span>{" "}
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
