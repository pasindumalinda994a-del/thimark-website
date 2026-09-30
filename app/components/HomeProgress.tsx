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

/** Same plus as the dashboard links' station mark. */
const MARK = 7;
const WEIGHT = 1.5;

function Plus() {
  const mid = MARK / 2;
  const inset = WEIGHT / 2;

  return (
    <svg
      aria-hidden
      width={MARK}
      height={MARK}
      viewBox={`0 0 ${MARK} ${MARK}`}
      fill="none"
      className="sb-index-plus size-[7px]"
    >
      <line
        x1={inset}
        y1={mid}
        x2={MARK - inset}
        y2={mid}
        stroke="currentColor"
        strokeWidth={WEIGHT}
        strokeLinecap="square"
      />
      <line
        x1={mid}
        y1={inset}
        x2={mid}
        y2={MARK - inset}
        stroke="currentColor"
        strokeWidth={WEIGHT}
        strokeLinecap="square"
      />
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
  const meter = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState<number | null>(null);

  useSectionFrame(true, (snap) => {
    const el = meter.current;
    if (!el) return;
    const at = snap.active;
    const overall = (at + (snap.progress[at] ?? 0)) / COUNT;
    el.style.transform = `scaleX(${overall.toFixed(4)})`;
  });

  const current = Math.max(0, active);
  const shown = focused ?? current;
  const trackStyle = {
    "--sb-at": `${shown}`,
    "--sb-count": `${COUNT}`,
  } as CSSProperties;

  return (
    <div
      className={`sb-panel ${className}`}
      aria-label="Homepage sections"
      role="navigation"
    >
      <div className="sb-panel-head">
        <span className="sidebar-group font-heading leading-none font-medium uppercase">
          Index
        </span>
        <span className="sb-panel-count index-tag" aria-live="polite">
          {padIndex(current)}
          <span className="text-steel/50">/{padIndex(COUNT - 1)}</span>
        </span>
        <span aria-hidden className="sb-index-meter">
          <span ref={meter} className="sb-index-meter-fill" />
        </span>
      </div>

      <div className="sb-progress">
        <div className="sb-index-window">
          <ol className="sb-index-track" style={trackStyle}>
            {HOME_SECTIONS.map((item, index) => {
              const isCurrent = index === current;
              return (
                <li
                  key={item.id}
                  className={`sb-index-item ${isCurrent ? "is-current" : ""}`}
                >
                  <a
                    href={`/#${item.id}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className="sb-index-row"
                    onClick={onNavigate}
                    onFocus={() => setFocused(index)}
                    onBlur={() => setFocused(null)}
                  >
                    <Plus />
                    <span aria-hidden className="sb-index-leader" />
                    <span className="sb-index-num index-tag">
                      {padIndex(index)}
                    </span>
                    <span className="sb-index-label font-heading font-medium uppercase">
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
