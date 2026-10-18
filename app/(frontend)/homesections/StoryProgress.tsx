import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";

export type StoryItem = {
  id: string;
  year: string;
  label: string;
  title: string;
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
    icon: "factory",
    image: "/pages/home/journey-founded1.webp",
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
    icon: "verified",
    image: "/pages/home/about-iso-precision.jpeg",
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
    title: "Heavy Fabrication Recognized",
    icon: "work",
    image: "/pages/home/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the workshop",
    objectPosition: "50% 42%",
    body: "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking an important milestone in its professional and manufacturing capabilities.",
    longBody:
      "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking an important milestone in its professional and manufacturing capabilities.",
  },
  {
    id: "automotive",
    year: "2022",
    label: "Automotive",
    title: "Entering Automotive Manufacturing",
    icon: "car",
    image: "/pages/home/about-automotive-manufacturing.jpeg",
    alt: "Engineers assembling motorcycle gearbox components",
    objectPosition: "42% 40%",
    body: "Thimark expanded into automotive parts manufacturing, beginning a new chapter in precision-engineered motorcycle components for local assembly programmes.",
    longBody:
      "Thimark expanded into automotive parts manufacturing, beginning a new chapter in precision-engineered motorcycle components for local assembly programmes.",
  },
  {
    id: "kengen",
    year: "2024",
    label: "KenGen",
    title: "Engineering Beyond Borders",
    icon: "precision",
    image: "/pages/home/about-international-engineering.jpeg",
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
    icon: "expand",
    image: "/pages/home/about-industrial-automation.jpeg",
    alt: "Engineers beside upgraded production machinery in a larger factory",
    objectPosition: "38% 45%",
    body: "Thimark expanded its factory to 15,000 sq. ft. and upgraded its machinery with advanced systems, strengthening its capacity for precision manufacturing and future growth.",
    longBody:
      "Thimark expanded its factory to 15,000 sq. ft. and upgraded its machinery with advanced systems, strengthening its capacity for precision manufacturing and future growth.",
  },
  {
    id: "finishing",
    year: "2026",
    label: "Surface Finishing",
    title: "Expanding Manufacturing Capability",
    icon: "precision",
    image: "/pages/home/quality-inspection.jpeg",
    alt: "Engineer inspecting a machined metal component with a digital caliper",
    objectPosition: "62% 35%",
    body: "Thimark planned to introduce a powder-coating facility at the Ekala IDB Industrial Zone, extending its manufacturing and finishing capabilities.",
    longBody:
      "Thimark planned to introduce a powder-coating facility at the Ekala IDB Industrial Zone, extending its manufacturing and finishing capabilities.",
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

export type StationItem = Pick<StoryItem, "id" | "label" | "year">;

export default function StoryProgress({
  items = STORY,
  label = "Company journey",
}: {
  items?: readonly StationItem[];
  label?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
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
