import type { GlyphKind } from "@/app/components/CapabilityGlyph";

export const STORY: {
  id: string;
  label: string;
  glyph: GlyphKind;
  image: string;
  alt: string;
  objectPosition: string;
  body: string;
}[] = [
  {
    id: "steel",
    label: "Steel Fabrication",
    glyph: "fabrication",
    image: "/home-images/about-steel-fabrication.jpeg",
    alt: "Fabricators welding structural steel in a workshop",
    objectPosition: "50% 45%",
    body: "Thimark began as a modest steel fabrication business — cutting, forming and welding to order for local industry. That hands-on fabrication capability remains the foundation of everything we build.",
  },
  {
    id: "iso",
    label: "ISO Certification",
    glyph: "precision",
    image: "/home-images/about-iso-precision.jpeg",
    alt: "Engineers inspecting a precision-machined gear assembly",
    objectPosition: "48% 40%",
    body: "Today, Thimark Technocreations (Pvt) Ltd combines mechanical engineering, fabrication and manufacturing expertise to serve the automotive, industrial, construction, water supply and hydropower sectors.",
  },
  {
    id: "automotive",
    label: "Automotive Manufacturing",
    glyph: "oem",
    image: "/home-images/about-automotive-manufacturing.jpeg",
    alt: "Engineers assembling motorcycle gearbox components",
    objectPosition: "42% 40%",
    body: "We serve the automotive sector with OEM components built around the demands of production environments, consistent quality and increased local value addition.",
  },
  {
    id: "automation",
    label: "Industrial Automation",
    glyph: "automation",
    image: "/home-images/about-industrial-automation.jpeg",
    alt: "Engineers operating an industrial automation line with a robotic arm",
    objectPosition: "38% 45%",
    body: "Industrial, construction, water supply and hydropower work sits on the same engineering mindset — machines designed around the challenge, not adapted to it.",
  },
  {
    id: "international",
    label: "International Engineering",
    glyph: "machinery",
    image: "/home-images/about-international-engineering.jpeg",
    alt: "Engineers inspecting industrial equipment at a hydropower installation",
    objectPosition: "62% 40%",
    body: "Our journey has taken us from local manufacturing to international engineering projects — including the design and manufacture of an automated trash-cleaning system for KenGen in Kenya.",
  },
];

export function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StationCopy({ label, index }: { label: string; index: number }) {
  return (
    <span className="about-station-copy">
      <span>{label}</span>
      <span aria-hidden>[{padIndex(index)}]</span>
    </span>
  );
}

export function StationPlus() {
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

export default function StoryProgress() {
  return (
    <div
      role="tablist"
      aria-label="Company story chapters"
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
          <StationCopy label={item.label} index={i} />
          <span aria-hidden data-story-wash="" className="about-station-wash">
            <StationCopy label={item.label} index={i} />
          </span>
          <span aria-hidden data-story-fill="" className="catalogue-tab-draw" />
        </button>
      ))}
    </div>
  );
}
