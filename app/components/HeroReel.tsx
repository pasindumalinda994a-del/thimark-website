"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  HERO_CLIP_DURATION,
  HERO_CLIPS,
} from "@/app/homesections/heroClips";

gsap.registerPlugin(useGSAP);

const CROSSFADE = 0.6;
const CAPTION_SHIFT = 8;

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
      className="size-[7px] shrink-0"
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

export default function HeroReel() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const fillsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const goToRef = useRef<(index: number) => void>(() => {});
  const skipCaption = useRef(true);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = captionRef.current;
      if (!el) return;
      if (skipCaption.current) {
        skipCaption.current = false;
        return;
      }
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
    gsap.set(fills, { scaleY: 0, transformOrigin: "center top" });

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    let visible = true;
    let pageHidden = document.hidden;
    let progressTween: gsap.core.Tween | undefined;
    let detachMedia: (() => void) | undefined;
    const activeIndex = { n: 0 };
    let goTo: (index: number) => void = () => {};

    const canRun = () => visible && !pageHidden && !reduced;

    const setFills = (index: number, currentScale: number) => {
      fills.forEach((fill, i) => {
        if (!fill) return;
        if (i < index) gsap.set(fill, { scaleY: 1 });
        else if (i === index) gsap.set(fill, { scaleY: currentScale });
        else gsap.set(fill, { scaleY: 0 });
      });
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
      progressTween?.kill();
      progressTween = gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: HERO_CLIP_DURATION,
          ease: "none",
          onComplete: () => goTo(index + 1),
        },
      );
    };

    const startProgress = (index: number) => {
      const fill = fills[index];
      const video = videosRef.current[index];
      const clip = HERO_CLIPS[index];

      setFills(index, 0);
      if (!canRun() || !fill) return;

      if (clip.src && video) {
        const onTimeUpdate = () => {
          const duration = video.duration;
          if (!duration || !Number.isFinite(duration)) return;
          gsap.set(fill, { scaleY: video.currentTime / duration });
        };
        const onEnded = () => {
          goTo(index + 1);
        };
        video.currentTime = 0;
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("ended", onEnded);
        detachMedia = () => {
          video.removeEventListener("timeupdate", onTimeUpdate);
          video.removeEventListener("ended", onEnded);
        };
        const play = video.play();
        if (play) {
          play.catch(() => {
            if (activeIndex.n !== index) return;
            detachMedia?.();
            detachMedia = undefined;
            startTimer(index);
          });
        }
        return;
      }

      startTimer(index);
    };

    const preloadAround = (index: number) => {
      const next = (index + 1) % HERO_CLIPS.length;
      videosRef.current.forEach((video, i) => {
        if (!video) return;
        video.preload = i === index || i === next ? "auto" : "metadata";
      });
    };

    goTo = contextSafe((index: number) => {
      const next =
        ((index % HERO_CLIPS.length) + HERO_CLIPS.length) % HERO_CLIPS.length;
      const prev = activeIndex.n;
      const same = next === prev;
      const prevLayer = layers[prev];
      const nextLayer = layers[next];

      stopClip();
      preloadAround(next);

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
      if (HERO_CLIPS[activeIndex.n].src && video) {
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
        return;
      }
      if (canRun()) resumePlayback();
    };

    const onVisibility = () => {
      pageHidden = document.hidden;
      if (pageHidden) pausePlayback();
      else resumePlayback();
    };

    if (reduced) setFills(0, 1);
    else startProgress(0);

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
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", syncMotion);
      stopClip();
    };
  });

  return (
    <>
      <div ref={mediaRef} className="hero-reel-media">
        {HERO_CLIPS.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              layersRef.current[index] = node;
            }}
            className={`absolute inset-0 ${index === 0 ? "opacity-100" : "opacity-0"}`}
          >
            {item.src ? (
              <video
                ref={(node) => {
                  videosRef.current[index] = node;
                }}
                src={item.src}
                poster={item.poster}
                muted
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                aria-label={item.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={item.poster}
                alt=""
                fill
                loading="eager"
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div className="hero-reel-scrim" aria-hidden />
      <div className="hero-reel-meta">
        <ol className="hero-reel-tracks" aria-label="Hero clips">
          {HERO_CLIPS.map((item, index) => {
            const isActive = index === active;

            return (
              <li key={item.id} className="flex min-h-0 flex-1 flex-col">
                <button
                  type="button"
                  aria-label={`Show clip ${padIndex(index)}: ${item.label}`}
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
                        className="min-w-0"
                      >
                        {item.label}
                      </span>
                    ) : null}
                  </span>
                  <span className="hero-reel-rail">
                    <span className="relative h-full w-[1.5px] overflow-hidden bg-cream/50">
                      <span
                        ref={(node) => {
                          fillsRef.current[index] = node;
                        }}
                        className="absolute inset-0 origin-top scale-y-0 bg-cream"
                      />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
