"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { HOME_SECTIONS } from "@/app/components/nav";

const COUNT = HOME_SECTIONS.length;

export function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

type Snapshot = {
  active: number;
  progress: number[];
};

let cache: { key: string; snap: Snapshot } | null = null;

/**
 * Reads the position of every homepage section relative to the viewport
 * midline. Results are memoised per scroll position so that several rails
 * (desktop aside + mobile overlay) share one set of layout reads per frame.
 */
function snapshot(): Snapshot {
  const vh = window.innerHeight;
  const key = `${Math.round(window.scrollY)}|${vh}`;
  if (cache && cache.key === key) return cache.snap;

  const mid = vh / 2;
  const progress: number[] = [];
  let active = 0;

  HOME_SECTIONS.forEach((section, index) => {
    const el = document.getElementById(section.id);
    if (!el) {
      progress.push(0);
      return;
    }
    // Pinned sections live inside a ScrollTrigger pin-spacer; measure that.
    const parent = el.parentElement;
    const box =
      parent && parent.classList.contains("pin-spacer") ? parent : el;
    const rect = box.getBoundingClientRect();
    const height = Math.max(rect.height, 1);
    const p = Math.min(1, Math.max(0, (mid - rect.top) / height));
    progress.push(p);
    if (rect.top <= mid) active = index;
  });

  const snap = { active, progress };
  cache = { key, snap };
  return snap;
}

function useSectionFrame(enabled: boolean, onFrame: (snap: Snapshot) => void) {
  const handler = useRef(onFrame);

  useEffect(() => {
    handler.current = onFrame;
  });

  useLenis(() => {
    if (!enabled) return;
    handler.current(snapshot());
  });

  useEffect(() => {
    if (!enabled) return;
    const run = () => handler.current(snapshot());
    run();
    const timer = window.setTimeout(run, 400);
    window.addEventListener("resize", run);
    window.addEventListener("thimark:preload-done", run);
    ScrollTrigger.addEventListener("refresh", run);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", run);
      window.removeEventListener("thimark:preload-done", run);
      ScrollTrigger.removeEventListener("refresh", run);
    };
  }, [enabled]);
}

/** Index of the homepage section currently spanning the viewport midline. */
export function useHomeSection(enabled: boolean) {
  const [active, setActive] = useState(0);
  useSectionFrame(enabled, (snap) => {
    setActive((current) => (current === snap.active ? current : snap.active));
  });
  return enabled ? active : -1;
}

function Tick({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      width={7}
      height={7}
      viewBox="0 0 7 7"
      fill="none"
      className="sb-tick"
    >
      {filled ? (
        <rect x="1.5" y="1.5" width="4" height="4" fill="currentColor" />
      ) : (
        <>
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
        </>
      )}
    </svg>
  );
}

type HomeProgressProps = {
  active: number;
  onNavigate?: () => void;
  className?: string;
};

export default function HomeProgress({
  active,
  onNavigate,
  className = "",
}: HomeProgressProps) {
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useSectionFrame(true, (snap) => {
    snap.progress.forEach((p, i) => {
      const el = fills.current[i];
      if (el) el.style.transform = `scaleY(${p.toFixed(4)})`;
    });
  });

  const current = Math.max(0, active);
  const shown = hovered ?? current;
  const readoutStyle = {
    "--sb-at": `${shown}`,
    "--sb-count": `${COUNT}`,
  } as CSSProperties;

  return (
    <div
      className={`sb-progress ${className}`}
      aria-label="Homepage sections"
      role="navigation"
    >
      <div className="sb-progress-head">
        <span className="sidebar-group font-heading leading-none font-medium text-steel uppercase">
          Index
        </span>
        <span className="index-tag text-steel" aria-live="polite">
          {padIndex(current)}
          <span className="text-steel/50"> / {padIndex(COUNT - 1)}</span>
        </span>
      </div>

      <div className="sb-progress-body">
        <ol className="sb-progress-track">
          {HOME_SECTIONS.map((item, index) => {
            const isActive = index === current;
            return (
              <li key={item.id} className="sb-progress-seg">
                <a
                  href={`/#${item.id}`}
                  aria-label={`Go to ${padIndex(index)} ${item.label}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`sb-station ${isActive ? "is-active" : ""}`}
                  onClick={onNavigate}
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                >
                  <Tick filled={isActive} />
                  <span aria-hidden className="sb-seg-rail">
                    <span
                      ref={(node) => {
                        fills.current[index] = node;
                      }}
                      className="sb-seg-fill"
                    />
                  </span>
                </a>
              </li>
            );
          })}
          <li aria-hidden className="sb-progress-end">
            <Tick filled={false} />
          </li>
        </ol>

        <div
          aria-hidden
          className={`sb-progress-names ${hovered !== null && hovered !== current ? "is-preview" : ""}`}
          style={readoutStyle}
        >
          <div className="sb-progress-names-track">
            {HOME_SECTIONS.map((item, index) => {
              const distance = Math.abs(index - shown);
              const place =
                distance === 0 ? "is-current" : distance === 1 ? "is-near" : "";
              return (
                <span key={item.id} className={`sb-progress-name ${place}`}>
                  <span className="sb-progress-name-leader" />
                  <span className="index-tag tabular-nums">{padIndex(index)}</span>
                  <span className="sb-progress-label font-heading text-[12px] leading-none font-medium uppercase">
                    {item.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
