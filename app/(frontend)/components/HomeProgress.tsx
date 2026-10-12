"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { type HomeSection } from "@/app/(frontend)/components/nav";

const EMPTY_SECTIONS: readonly HomeSection[] = [];

export function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

type Snapshot = {
  active: number;
  progress: number[];
};

let cache: { key: string; snap: Snapshot } | null = null;

function sectionKey(sections: readonly HomeSection[]) {
  return sections.map((section) => section.id).join("|");
}

/**
 * Reads the position of every listed section relative to the viewport
 * midline. Results are memoised per section list and scroll position so
 * that the rail and the nav highlight share one set of layout reads per frame.
 */
function snapshot(sections: readonly HomeSection[]): Snapshot {
  const vh = window.innerHeight;
  const key = `${sectionKey(sections)}|${Math.round(window.scrollY)}|${vh}`;
  if (cache && cache.key === key) return cache.snap;

  const mid = vh / 2;
  const progress: number[] = [];
  let active = 0;

  sections.forEach((section, index) => {
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

function useSectionFrame(
  enabled: boolean,
  sections: readonly HomeSection[],
  onFrame: (snap: Snapshot) => void,
) {
  const handler = useRef(onFrame);
  const sectionsRef = useRef(sections);
  const key = sectionKey(sections);

  useEffect(() => {
    handler.current = onFrame;
    sectionsRef.current = sections;
  });

  useLenis(() => {
    if (!enabled) return;
    handler.current(snapshot(sectionsRef.current));
  });

  useEffect(() => {
    if (!enabled) return;
    const run = () => handler.current(snapshot(sectionsRef.current));
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
  }, [enabled, key]);
}

/** Index of the section currently spanning the viewport midline. */
export function useHomeSection(sections: readonly HomeSection[] | undefined) {
  const list = sections ?? EMPTY_SECTIONS;
  const enabled = list.length > 0;
  const key = sectionKey(list);
  const [active, setActive] = useState(0);
  const [seenKey, setSeenKey] = useState(key);

  if (seenKey !== key) {
    setSeenKey(key);
    setActive(0);
  }

  useSectionFrame(enabled, list, (snap) => {
    setActive((current) => (current === snap.active ? current : snap.active));
  });
  return enabled ? (seenKey === key ? active : 0) : -1;
}

function midlineNavId(
  sections: readonly { id: string; navId: string }[],
): string | null {
  const height = window.innerHeight;
  let navId: string | null = null;
  let best = 0;

  for (const section of sections) {
    const el = document.getElementById(section.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const overlap = Math.min(rect.bottom, height) - Math.max(rect.top, 0);
    if (overlap > best) {
      best = overlap;
      navId = section.navId;
    }
  }

  return navId;
}

/** Nav id of the division section occupying the most of the viewport. */
export function useMidlineNavId(
  sections: readonly { id: string; navId: string }[],
  enabled: boolean,
) {
  const [navId, setNavId] = useState<string | null>(null);
  const sectionsRef = useRef(sections);
  const key = sections.map((section) => `${section.id}:${section.navId}`).join("|");

  useEffect(() => {
    sectionsRef.current = sections;
  });

  useLenis(() => {
    if (!enabled) return;
    const next = midlineNavId(sectionsRef.current);
    setNavId((current) => (current === next ? current : next));
  });

  useEffect(() => {
    if (!enabled) return;
    const run = () => {
      const next = midlineNavId(sectionsRef.current);
      setNavId((current) => (current === next ? current : next));
    };
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
  }, [enabled, key]);

  return enabled ? navId : null;
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

function sectionHref(pathname: string, id: string) {
  const path = pathname === "/" ? "/" : pathname;
  return `${path}#${id}`;
}

type HomeProgressProps = {
  sections: readonly HomeSection[];
  pathname: string;
  active: number;
  onNavigate?: () => void;
  className?: string;
};

export default function HomeProgress({
  sections,
  pathname,
  active,
  onNavigate,
  className = "",
}: HomeProgressProps) {
  const meter = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const count = sections.length;

  useSectionFrame(count > 0, sections, (snap) => {
    const el = meter.current;
    if (!el || count === 0) return;
    const at = snap.active;
    const overall = (at + (snap.progress[at] ?? 0)) / count;
    el.style.transform = `scaleX(${overall.toFixed(4)})`;
  });

  const current = Math.min(Math.max(0, active), Math.max(0, count - 1));
  const shown = focused ?? current;
  const trackStyle = {
    "--sb-at": `${shown}`,
    "--sb-count": `${count}`,
  } as CSSProperties;

  return (
    <div
      className={`sb-panel ${className}`}
      aria-label="Page sections"
      role="navigation"
    >
      <div className="sb-panel-head">
        <span className="sidebar-group font-heading leading-none font-medium uppercase">
          Index
        </span>
        <span className="sb-panel-count index-tag" aria-live="polite">
          {padIndex(current)}
          <span className="text-steel/50">/{padIndex(count - 1)}</span>
        </span>
        <span aria-hidden className="sb-index-meter">
          <span ref={meter} className="sb-index-meter-fill" />
        </span>
      </div>

      <div className="sb-progress">
        <div className="sb-index-window">
          <ol className="sb-index-track" style={trackStyle}>
            {sections.map((item, index) => {
              const isCurrent = index === current;
              return (
                <li
                  key={item.id}
                  className={`sb-index-item ${isCurrent ? "is-current" : ""}`}
                >
                  <a
                    href={sectionHref(pathname, item.id)}
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
