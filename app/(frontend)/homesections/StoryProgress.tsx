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
    label: "New Factory",
    title: "A New Foundation",
    glyph: "fabrication",
    icon: "factory",
    image: "/home-images/about-steel-fabrication.jpeg",
    alt: "Fabricators welding structural steel in a workshop",
    objectPosition: "50% 45%",
    body: "Relocated to a newly built factory, laying the foundation for growth.",
    longBody:
      "Thimark relocated to a newly built factory, establishing the foundation for its next phase of growth.",
  },
  {
    id: "iso",
    year: "2019",
    label: "ISO 9001",
    title: "Quality Becomes a System",
    glyph: "precision",
    icon: "verified",
    image: "/home-images/about-iso-precision.jpeg",
    alt: "Engineers inspecting a precision-machined component in a factory",
    objectPosition: "48% 40%",
    body: "Achieved ISO 9001:2015 certification.",
    longBody:
      "The company achieved ISO 9001:2015 certification, strengthening its commitment to structured quality management and consistent manufacturing practices.",
  },
  {
    id: "cida",
    year: "2020",
    label: "CIDA EM2",
    title: "Heavy Fabrication Capability",
    glyph: "engineering",
    icon: "work",
    image: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the workshop",
    objectPosition: "50% 42%",
    body: "Awarded CIDA EM2 Grade in Heavy Steel Fabrication.",
    longBody:
      "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking another step in its development as an engineering and fabrication organization.",
  },
  {
    id: "automotive",
    year: "2021",
    label: "Automotive",
    title: "Into Automotive Manufacturing",
    glyph: "oem",
    icon: "car",
    image: "/home-images/about-automotive-manufacturing.jpeg",
    alt: "Engineers assembling motorcycle gearbox components",
    objectPosition: "42% 40%",
    body: "Commenced automotive parts manufacturing.",
    longBody:
      "Thimark expanded into automotive parts manufacturing, opening a new chapter in OEM component production.",
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
    body: "Designed and manufactured an automated trash cleaning machine for KenGen (Kenya).",
    longBody:
      "Thimark designed and manufactured an automated trash-cleaning machine for KenGen in Kenya, demonstrating its growing capabilities in industrial automation and international engineering projects.",
  },
  {
    id: "expansion",
    year: "2025",
    label: "Expansion",
    title: "Expanding Manufacturing Capability",
    glyph: "automation",
    icon: "expand",
    image: "/home-images/about-industrial-automation.jpeg",
    alt: "Engineers beside upgraded production machinery in a larger factory",
    objectPosition: "38% 45%",
    body: "Expanded the factory to 15,000 sq ft and upgraded machinery and manufacturing systems.",
    longBody:
      "The factory expanded to 15,000 sq. ft., alongside upgrades to machinery and manufacturing systems.",
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
