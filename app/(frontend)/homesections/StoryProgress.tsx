import {
  JOURNEY,
  type JourneyItem,
} from "@/app/(frontend)/homesections/home";

/** @deprecated Prefer JourneyItem from home.ts */
export type StoryItem = JourneyItem;

/** @deprecated Prefer JOURNEY from home.ts */
export const STORY = JOURNEY;

export function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StationCopy({ label, year }: { label: string; year: string }) {
  return (
    <span className="about-station-copy">
      <span>{label}</span>
      <span className="tabular-nums">{year}</span>
    </span>
  );
}

/** Same length and thickness as the leader dash. Mirrors --plus-size and --stroke. */
const MARK = 7;
const WEIGHT = 1.5;

export function StationPlus() {
  const mid = MARK / 2;
  const inset = WEIGHT / 2;

  return (
    <svg
      aria-hidden
      width={MARK}
      height={MARK}
      viewBox={`0 0 ${MARK} ${MARK}`}
      fill="none"
      className="size-[7px] shrink-0"
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

export function StationDash() {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 bg-current"
      style={{ width: MARK, height: WEIGHT }}
    />
  );
}

export type StationItem = Pick<JourneyItem, "id" | "label" | "year">;

export default function StoryProgress({
  items = JOURNEY,
  label = "Company journey",
}: {
  items?: readonly StationItem[];
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="about-tabs">
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          data-story-station=""
          aria-selected={i === 0}
          className="catalogue-tab index-tag outline-none"
        >
          {i > 0 ? (
            <span aria-hidden className="catalogue-tab-divider" />
          ) : null}
          <StationCopy label={item.label} year={item.year} />
          <span aria-hidden data-story-wash="" className="about-station-wash">
            <StationCopy label={item.label} year={item.year} />
          </span>
        </button>
      ))}
    </div>
  );
}
