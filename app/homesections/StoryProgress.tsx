import type { GlyphKind } from "@/app/components/CapabilityGlyph";

export const STORY: {
  id: string;
  year: string;
  label: string;
  glyph: GlyphKind;
  image: string;
  alt: string;
  objectPosition: string;
  body: string;
}[] = [
  {
    id: "founded",
    year: "2014",
    label: "Founded",
    glyph: "fabrication",
    image: "/home-images/about-steel-fabrication.jpeg",
    alt: "Fabricators welding structural steel in a workshop",
    objectPosition: "50% 45%",
    body: "Founded as a backyard steel fabrication business.",
  },
  {
    id: "iso",
    year: "2019",
    label: "ISO 9001",
    glyph: "precision",
    image: "/home-images/about-iso-precision.jpeg",
    alt: "Engineers inspecting a precision-machined component in a factory",
    objectPosition: "48% 40%",
    body: "Relocated to a newly built factory and achieved ISO 9001:2015 certification.",
  },
  {
    id: "cida",
    year: "2020",
    label: "CIDA EM2",
    glyph: "engineering",
    image: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the workshop",
    objectPosition: "50% 42%",
    body: "Awarded CIDA EM2 Grade in Heavy Steel Fabrication.",
  },
  {
    id: "automotive",
    year: "2022",
    label: "Automotive",
    glyph: "oem",
    image: "/home-images/about-automotive-manufacturing.jpeg",
    alt: "Engineers assembling motorcycle gearbox components",
    objectPosition: "42% 40%",
    body: "Commenced automotive parts manufacturing.",
  },
  {
    id: "kengen",
    year: "2024",
    label: "KenGen",
    glyph: "machinery",
    image: "/home-images/about-international-engineering.jpeg",
    alt: "Engineers inspecting a trash-cleaning machine at a hydropower intake",
    objectPosition: "62% 40%",
    body: "Designed and manufactured an automated trash cleaning machine for KenGen (Kenya).",
  },
  {
    id: "expansion",
    year: "2025",
    label: "Expansion",
    glyph: "automation",
    image: "/home-images/about-industrial-automation.jpeg",
    alt: "Engineers beside upgraded production machinery in a larger factory",
    objectPosition: "38% 45%",
    body: "Expanded the factory to 15,000 sq ft, upgraded machinery with state-of-the-art systems, and implemented lean manufacturing practices.",
  },
  {
    id: "coating",
    year: "2026",
    label: "Coating",
    glyph: "coating",
    image: "/home-images/quality-continuous-improvement.jpeg",
    alt: "Engineers reviewing production plans for a new coating facility",
    objectPosition: "48% 38%",
    body: "Launching a powder coating facility at Ekala IDB Industrial Zone.",
  },
];

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

export default function StoryProgress() {
  return (
    <div
      role="tablist"
      aria-label="Company journey"
      className="about-tabs"
    >
      {STORY.map((item, i) => (
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
