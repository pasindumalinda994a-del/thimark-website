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
  eyebrow: "Automotive Components \u00b7 OEM Manufacturing",
  heading: ["Precision Components.", "Built for Production."],
  intro:
    "We manufacture precision-engineered motorcycle components for modern vehicle assembly \u2014 stands, brackets, guards, handlebars and carriers, built with practical engineering and dependable quality.",
  body: "With Sri Lankan manufacturers and assembly partners, we turn engineering requirements into production-ready components that support local value addition.",
  supporting: ["Practical Engineering.", "Consistent Manufacturing.", "Dependable Quality."],
  cta: { label: "Enquire About Automotive Components", href: "/enquire" },
  image: {
    src: "/home-images/two-core-automotive.jpeg",
    alt: "Engineers assembling a motorcycle frame on the production line",
    objectPosition: "50% 50%",
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
    src: "/home-images/two-core-automotive.png",
    alt: "Precision motorcycle components laid out on a workshop bench",
    objectPosition: "50% 50%",
  } satisfies Media,
  rangeLabel: "Our Component Range",
  closing:
    "From individual parts to coordinated ranges, we manufacture components that fit their application and support vehicle assembly.",
  cta: { label: "Explore Our Production Process", href: "#process" } satisfies Link,
} as const;

export type ComponentGroup = {
  id: string;
  title: string;
  items: readonly string[];
  icon: IsoIcon;
};

export const COMPONENTS: readonly ComponentGroup[] = [
  {
    id: "stands",
    title: "Stands & Supports",
    items: ["Centre stands", "Side stands", "Engine hangers"],
    icon: "car",
  },
  {
    id: "guards",
    title: "Guards & Protection",
    items: ["Leg guards", "Saree guards", "Belly pans"],
    icon: "verified",
  },
  {
    id: "handlebars",
    title: "Handlebars & Carriers",
    items: ["Handlebars", "Rear carriers", "Bar pillions"],
    icon: "expand",
  },
  {
    id: "brackets",
    title: "Brackets & Mounting Components",
    items: ["Speedometer brackets", "Battery brackets", "Seat latches", "Hooks"],
    icon: "schema",
  },
  {
    id: "tools",
    title: "Tools & Other Components",
    items: [
      "Flat spanners",
      "Other custom metallic components developed to meet specific manufacturing requirements",
    ],
    icon: "work",
  },
];

/* ---- 02 OEM Manufacturing & Partnerships --------------------------- */

export const OEM = {
  index: "02",
  eyebrow: "Working with Industry",
  heading: ["Built Around OEM Requirements.", "Driven by Manufacturing Reliability."],
  intro:
    "OEM manufacturing means understanding design specifications, materials, production processes, dimensional consistency and the needs of final assembly.",
  band: {
    label: "Our Approach",
    callout: ["Local Vehicle Assembly", "Sri Lanka"],
    lead: "Thimark works with Sri Lankan automotive businesses to manufacture motorcycle components for local vehicle assembly.",
    paragraphs: [
      "By combining engineering knowledge with in-house manufacturing processes, we help translate component requirements into practical, production-ready solutions.",
      "Our approach emphasizes dependable production, process consistency and collaboration with our partners to meet application-specific requirements.",
    ],
    media: {
      src: "/home-images/about-automotive-manufacturing.jpeg",
      alt: "Engineers assembling motorcycle components on the Thimark shop floor",
      objectPosition: "42% 40%",
    } satisfies Media,
  },
  partnersLabel: "Supporting Motorcycle Assembly in Sri Lanka",
  modelsLabel: "Components associated with",
  closingLabel: "Local Value Addition",
  closing:
    "Through these manufacturing relationships, Thimark contributes to the development of local automotive production capability and supports greater value addition within Sri Lanka.",
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

/* ---- 03 Production Process ----------------------------------------- */

export const PROCESS = {
  index: "03",
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
  media: Media;
};

// Stage photography is provisional until dedicated process shots are available.
export const STAGES: readonly Stage[] = [
  {
    id: "cutting",
    label: "Cutting",
    title: "Laser & Profile Cutting",
    body: "Sheet metal, tubes and profiles are cut to the required shapes and dimensions, setting the foundation for forming and assembly.",
    operations: ["Sheet metal", "Tubes", "Profiles"],
    icon: "precision",
    media: {
      src: "/home-images/about-industrial-automation.jpeg",
      alt: "Production machinery prepared for cutting operations at Thimark",
      objectPosition: "38% 45%",
    },
  },
  {
    id: "forming",
    label: "Forming",
    title: "Forming & Bending",
    body: "Using press brakes, pipe-bending equipment and stamping processes, cut materials are shaped to meet component geometry and design requirements.",
    operations: ["Press brake", "Pipe bending", "Stamping"],
    icon: "factory",
    media: {
      src: "/home-images/quality-lean-production.jpeg",
      alt: "Operators forming parts on an organized production line",
      objectPosition: "38% 42%",
    },
  },
  {
    id: "machining",
    label: "Machining",
    title: "Machining & Preparation",
    body: "Drilling, threading, countersinking, grinding and edge finishing prepare components for accurate fitting, joining and assembly.",
    operations: ["Drilling", "Threading", "Countersinking", "Grinding", "Edge finishing"],
    icon: "schema",
    media: {
      src: "/home-images/about-iso-precision.jpeg",
      alt: "Engineer inspecting a precision-machined component",
      objectPosition: "48% 40%",
    },
  },
  {
    id: "joining",
    label: "Joining",
    title: "Joining & Sub-Assembly",
    body: "Welding and suitable joining processes create functional components and sub-assemblies, including robotic and resistance spot welding where needed.",
    operations: ["Welding", "Robotic welding", "Resistance spot welding"],
    icon: "work",
    media: {
      src: "/home-images/about-steel-fabrication.jpeg",
      alt: "Fabricators welding steel assemblies in the Thimark workshop",
      objectPosition: "50% 45%",
    },
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
    icon: "work",
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
    icon: "car",
  },
  {
    id: "improvement",
    tag: "Improvement",
    title: "Continuous Manufacturing Improvement",
    body: "Kanban, 5S and Kaizen for organized, improving production.",
    icon: "expand",
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
