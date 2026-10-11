import type { GlyphKind } from "@/app/(frontend)/components/CapabilityGlyph";
import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";

export type StoryItem = {
  id: string;
  year: string;
  label: string;
  title: string;
  glyph: GlyphKind;
  icon: IsoIcon;
  image: string;
  alt: string;
  objectPosition: string;
  body: string;
  longBody: string;
};

export const STORY: StoryItem[] = [
  {
    id: "foundation",
    year: "2014",
    label: "Founded",
    title: "From the Ground Up",
    glyph: "fabrication",
    icon: "factory",
    image: "/home-images/about-steel-fabrication.jpeg",
    alt: "Fabricators welding structural steel in a workshop",
    objectPosition: "50% 45%",
    body: "Thimark\u2019s journey began as a backyard steel fabrication business, laying the foundation for the engineering capabilities that would follow.",
    longBody:
      "Thimark\u2019s journey began as a backyard steel fabrication business, laying the foundation for the engineering capabilities that would follow.",
  },
  {
    id: "iso",
    year: "2019",
    label: "ISO 9001",
    title: "A New Standard of Quality",
    glyph: "precision",
    icon: "verified",
    image: "/home-images/about-iso-precision.jpeg",
    alt: "Engineers inspecting a precision-machined component in a factory",
    objectPosition: "48% 40%",
    body: "Thimark achieved ISO 9001:2015 certification, establishing a formal quality management framework and strengthening its commitment to consistent manufacturing standards.",
    longBody:
      "Thimark achieved ISO 9001:2015 certification, establishing a formal quality management framework and strengthening its commitment to consistent manufacturing standards.",
  },
  {
    id: "cida",
    year: "2020",
    label: "CIDA EM2",
    title: "Heavy Fabrication Capability Recognized",
    glyph: "engineering",
    icon: "work",
    image: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the workshop",
    objectPosition: "50% 42%",
    body: "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking an important recognition of its professional and manufacturing capabilities.",
    longBody:
      "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking an important recognition of its professional and manufacturing capabilities.",
  },
  {
    id: "automotive",
    year: "2021",
    label: "Automotive",
    title: "Entering Automotive Manufacturing",
    glyph: "oem",
    icon: "car",
    image: "/home-images/about-automotive-manufacturing.jpeg",
    alt: "Engineers assembling motorcycle gearbox components",
    objectPosition: "42% 40%",
    body: "Thimark expanded into automotive parts manufacturing, beginning a new chapter as an OEM manufacturing partner for local motorcycle assembly programs.",
    longBody:
      "Thimark expanded into automotive parts manufacturing, beginning a new chapter as an OEM manufacturing partner for local motorcycle assembly programs.",
  },
  {
    id: "kengen",
    year: "2024",
    label: "KenGen",
    title: "Engineering Beyond Borders",
    glyph: "machinery",
    icon: "precision",
    image: "/home-images/about-international-engineering.jpeg",
    alt: "Engineers inspecting a trash-cleaning machine at a hydropower intake",
    objectPosition: "62% 40%",
    body: "Thimark designed and manufactured the Kilgharrah 600 automated trash-cleaning machine for Kenya Electricity Generating Company (KenGen), marking a major international engineering achievement.",
    longBody:
      "Thimark designed and manufactured the Kilgharrah 600 automated trash-cleaning machine for Kenya Electricity Generating Company (KenGen), marking a major international engineering achievement.",
  },
  {
    id: "expansion",
    year: "2025",
    label: "Expansion",
    title: "Building for the Next Chapter",
    glyph: "automation",
    icon: "expand",
    image: "/home-images/about-industrial-automation.jpeg",
    alt: "Engineers beside upgraded production machinery in a larger factory",
    objectPosition: "38% 45%",
    body: "Thimark expanded its factory to 15,000 sq. ft. and upgraded its machinery with state-of-the-art systems, strengthening its capacity for advanced manufacturing and future growth.",
    longBody:
      "Thimark expanded its factory to 15,000 sq. ft. and upgraded its machinery with state-of-the-art systems, strengthening its capacity for advanced manufacturing and future growth.",
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

export default function StoryProgress({ items = STORY }: { items?: StoryItem[] }) {
  return (
    <div
      role="tablist"
      aria-label="Company journey"
      className="about-tabs"
    >
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
