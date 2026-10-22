import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type {
  Capability,
  CapabilitiesCopy,
} from "@/app/(frontend)/homesections/CapabilitiesSection";
import type { HeroCopy } from "@/app/(frontend)/about/pagesection/AboutHero";

type Link = { label: string; href: string };
type Media = { src: string; alt: string; objectPosition: string };

/* ---- Hero ---------------------------------------------------------- */

export const HERO: HeroCopy = {
  eyebrow: "Automotive Component Manufacturer \u00b7 Sri Lanka",
  heading: ["Precision Motorcycle Components.", "Built for OEM Production."],
  intro:
    "As an OEM motorcycle parts manufacturer in Sri Lanka, we make precision-engineered components for vehicle assembly \u2014 stands, brackets, guards, handlebars and carriers, built with practical engineering and dependable quality.",
  body: "With Sri Lankan manufacturers and assembly partners, we turn engineering requirements into production-ready components that support local value addition.",
  supporting: ["Practical Engineering.", "Consistent Manufacturing.", "Dependable Quality."],
  cta: { label: "Request a Component Quote", href: "/enquire?service=automotive" },
  secondary: { label: "See the Component Range", href: "#product-range" },
  image: {
    // Test: hero-R1 | R2 | R3
    src: "/pages/automotive/hero-R1.webp",
    alt: "Engineers assembling a motorcycle frame on the production line",
    objectPosition: "50% 30%",
  },
  caption: ["Fig. 01", "Thimark Automotive Components"],
};

/* ---- 01 Product Range ---------------------------------------------- */

export const RANGE = {
  index: "01",
  eyebrow: "Our Product Range",
  heading: ["Engineered for Every Connection.", "Built for Every Journey."],
  lede: "Every component plays a role in the performance, functionality and assembly of a motorcycle.",
  headLabel: "Metallic Motorcycle Components",
  headMeta: "OEM \u00b7 Assembly",
  paragraphs: [
    "At Thimark, we manufacture a range of metallic components designed to meet specific vehicle requirements and support reliable production.",
    "Our range covers structural supports, protective guards, mounting brackets and functional accessories, each made to its design, dimensions and assembly application.",
  ],
  media: {
    // Test: range-R1 | R2 | R3
    src: "/pages/automotive/range-R1.webp",
    alt: "Precision OEM motorcycle components laid out on a Thimark workshop bench",
    objectPosition: "50% 50%",
  } satisfies Media,
  rangeLabel: "Our Component Range",
  closing:
    "From individual parts to coordinated ranges, we manufacture components that fit their application and support vehicle assembly.",
  cta: { label: "See the Production Process", href: "#process" } satisfies Link,
} as const;

export type ComponentGroup = {
  id: string;
  title: string;
  items: readonly string[];
  media: Media;
};

export const COMPONENTS: readonly ComponentGroup[] = [
  {
    id: "stands",
    title: "Stands & Supports",
    items: ["Centre stands", "Side stands", "Engine hangers"],
    media: {
      // Test: stands-R1 | R2 | R3
      src: "/pages/automotive/stands-R1.webp",
      alt: "Rows of black-coated motorcycle stand and support components on the Thimark workbench",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "guards",
    title: "Guards & Protection",
    items: ["Leg guards", "Saree guards", "Belly pans"],
    media: {
      // Test: guards-R1 | R2 | R3
      src: "/pages/automotive/guards-R1.webp",
      alt: "Bridge-shaped brackets and circular metal framing parts for motorcycle protection",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "handlebars",
    title: "Handlebars & Carriers",
    items: ["Handlebars", "Rear carriers", "Bar pillions"],
    media: {
      // Test: handlebars-R1 | R2 | R3
      src: "/pages/automotive/handlebars-R1.webp",
      alt: "Four matte black motorcycle handlebars lined up on the workshop bench",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "brackets",
    title: "Brackets & Mounting Components",
    items: ["Speedometer brackets", "Battery brackets", "Seat latches", "Hooks"],
    media: {
      // Test: brackets-R1 | R2 | R3
      src: "/pages/automotive/brackets-R1.webp",
      alt: "Stamped black motorcycle mounting brackets and chassis flanges",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "tools",
    title: "Tools & Other Components",
    items: [
      "Flat spanners",
      "Other custom metallic components developed to meet specific manufacturing requirements",
    ],
    media: {
      // Test: tools-R1 | R2 | R3
      src: "/pages/automotive/tools-R1.webp",
      alt: "Small QA-labeled motorcycle clips and custom metallic components",
      objectPosition: "50% 45%",
    },
  },
];

/* ---- 02 OEM Manufacturing & Partnerships --------------------------- */

export const OEM = {
  index: "02",
  eyebrow: "Working with Industry",
  heading: ["Built Around OEM Requirements.", "Driven by Manufacturing Reliability."],
  intro:
    "OEM manufacturing means understanding specs, materials, processes and the needs of final assembly.",
  band: {
    label: "Our Approach",
    callout: ["Local Vehicle Assembly", "Sri Lanka"],
    lead: "Thimark works with Sri Lankan automotive businesses to manufacture motorcycle components for local vehicle assembly.",
    paragraphs: [
      "By combining engineering knowledge with in-house manufacturing processes, we help translate component requirements into practical, production-ready solutions.",
      "Our approach emphasizes dependable production, process consistency and collaboration with our partners to meet application-specific requirements.",
    ],
    media: {
      // Test: oem-R1 | R2 | R3
      src: "/pages/automotive/oem-R2.webp",
      alt: "Engineers assembling motorcycle components on the Thimark shop floor",
      objectPosition: "42% 40%",
    } satisfies Media,
  },
  partnersLabel: "Supporting Motorcycle Assembly in Sri Lanka",
  modelsLabel: "Components associated with",
} as const;

export type OemPartner = {
  /** Matches an id in homesections/partners.ts. */
  id: string;
  lead?: string;
  models: readonly string[];
};

// Confirm vehicle models and partner references against current supply
// arrangements before publication. Use partner logos only with permission.
export const OEM_PARTNERS: readonly OemPartner[] = [
  {
    id: "dpmc",
    lead: "Bajaj motorcycle applications, including",
    models: ["Bajaj CT 100", "Bajaj Pulsar N160"],
  },
  {
    id: "senaro",
    models: ["Senaro GN125", "Senaro Click 150i"],
  },
  {
    id: "ranomoto",
    models: ["Ranomoto Active 100", "Ranomoto Pattaya", "Ranomoto Moped"],
  },
];

/* ---- 03 Local Value Addition --------------------------------------- */

export const VALUE = {
  index: "03",
  eyebrow: "Made in Sri Lanka",
  heading: ["Supporting Local", "Value Addition."],
  lede: "Through these relationships, Thimark builds local production capability and greater value addition in Sri Lanka.",
  figure: "30%",
  figureLabel: "Local value addition",
  lines: [
    "Metallic components made in Sri Lanka.",
    "Supplied for local motorcycle assembly.",
    "Value kept in the local supply chain.",
  ],
} as const;

/* ---- 04 Production Process ----------------------------------------- */

export const PROCESS_CTA = {
  label: "Request a Component Quote",
  href: "/enquire?service=automotive",
} satisfies Link;

export const PROCESS = {
  index: "04",
  eyebrow: "From Material to Component",
  heading: ["Precision at Every Stage", "of Production."],
  lede: [
    "A dependable component begins with the right process \u2014 cutting, forming, machining and joining, from raw material to a part ready for its application.",
    "Each stage contributes to the accuracy, consistency and functionality required for automotive assembly.",
  ],
  readoutLabel: "Stage",
  statement:
    "From the first cut to the final assembly, every operation supports the goal of producing components that meet defined manufacturing requirements.",
} as const;

export type Stage = {
  id: string;
  /** Tab label. */
  label: string;
  title: string;
  body: string;
  operations: readonly string[];
  icon: IsoIcon;
  /** Required for `visual="photo"`; omit for glyph-led stages (NPD). */
  media?: Media;
};

export const STAGES: readonly Stage[] = [
  {
    id: "cutting",
    label: "Cutting",
    title: "Laser & Profile Cutting",
    body: "Sheet metal, tubes and profiles are cut to the required shapes and dimensions, setting the foundation for forming and assembly.",
    operations: ["Sheet metal", "Tubes", "Profiles"],
    icon: "laser",
  },
  {
    id: "forming",
    label: "Forming",
    title: "Forming & Bending",
    body: "Using press brakes, pipe-bending equipment and stamping processes, cut materials are shaped to meet component geometry and design requirements.",
    operations: ["Press brake", "Pipe bending", "Stamping"],
    icon: "mitre",
  },
  {
    id: "machining",
    label: "Machining",
    title: "Machining & Preparation",
    body: "Drilling, threading, countersinking, grinding and edge finishing prepare components for accurate fitting, joining and assembly.",
    operations: ["Drilling", "Threading", "Countersinking", "Grinding", "Edge finishing"],
    icon: "precision",
  },
  {
    id: "joining",
    label: "Joining",
    title: "Joining & Sub-Assembly",
    body: "Welding and suitable joining processes create functional components and sub-assemblies, including robotic and resistance spot welding where needed.",
    operations: ["Welding", "Robotic welding", "Resistance spot welding"],
    icon: "flame",
  },
];

/* ---- 04 Manufacturing Capabilities --------------------------------- */

export const CAPABILITIES_COPY: CapabilitiesCopy = {
  eyebrow: "Manufacturing Strength",
  heading: ["The Capability to Make It.", "The Discipline to Make It Consistently."],
  lede: [
    "Reliable automotive manufacturing requires the right combination of engineering knowledge, production equipment, skilled people and repeatable processes.",
    "We bring them together for OEM and assembly, from material through forming, machining and welding.",
  ],
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Laser cutting, press-brake forming, pipe bending and machining for defined shapes.",
    icon: "precision",
  },
  {
    id: "welding",
    tag: "Welding",
    title: "Welding & Component Assembly",
    body: "Robotic and spot welding for functional parts and sub-assemblies.",
    icon: "flame",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering-Led Production",
    body: "Design that turns requirements into manufacturable production solutions.",
    icon: "schema",
  },
  {
    id: "oem",
    tag: "OEM",
    title: "OEM-Focused Manufacturing",
    body: "Motorcycle components built with local manufacturers and assembly partners.",
    icon: "motorcycle",
  },
  {
    id: "improvement",
    tag: "Improvement",
    title: "Continuous Manufacturing Improvement",
    body: "Kanban, 5S and Kaizen for organized, improving production.",
    icon: "cycle",
  },
  {
    id: "local",
    tag: "Local Value",
    title: "Supporting Local Value Addition",
    body: "Metallic components made locally for Sri Lanka\u2019s supply chain.",
    icon: "factory",
  },
];

export const CLOSING_PHRASES = [
  "Engineering.",
  "Manufacturing Discipline.",
  "Production Capability.",
] as const;
