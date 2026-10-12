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
    "At Thimark, we manufacture precision-engineered motorcycle components designed to meet the demands of modern vehicle assembly. From stands and brackets to guards, handlebars and carriers, our components combine practical engineering, consistent manufacturing and dependable quality.",
  body: "Working with Sri Lankan motorcycle manufacturers and assembly partners, we turn engineering requirements into production-ready components that support local manufacturing and value addition.",
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
    "Our capabilities cover a wide range of motorcycle parts, from structural supports and protective guards to mounting brackets and functional accessories. Each component is manufactured with attention to its design, dimensions, forming requirements and assembly application.",
  ],
  media: {
    src: "/home-images/two-core-automotive.png",
    alt: "Precision motorcycle components laid out on a workshop bench",
    objectPosition: "50% 50%",
  } satisfies Media,
  rangeLabel: "Our Component Range",
  closing:
    "From individual parts to coordinated component ranges, our focus remains on manufacturing components that fit their intended application and support the needs of vehicle assembly.",
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
    "Successful OEM manufacturing depends on more than producing a component. It requires an understanding of design specifications, material requirements, production processes, dimensional consistency and the needs of the final assembly.",
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
    "A dependable component begins with the right process. At Thimark, manufacturing combines cutting, forming, machining and joining operations to transform raw material into components ready for their intended application.",
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
    body: "The manufacturing process begins by cutting sheet metal, tubes and profiles to the required shapes and dimensions. Accurate cutting establishes the foundation for subsequent forming and assembly operations.",
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
    body: "Welding and suitable joining processes bring individual parts together to create functional components and sub-assemblies. Depending on the application, this can include robotic or resistance spot welding.",
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
    "Thimark brings these elements together to manufacture metallic motorcycle components for OEM and assembly applications, from material processing through forming, machining, welding and sub-assembly.",
  ],
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Laser and profile cutting, CNC and NC press-brake operations, pipe bending, stamping and machining support the production of components with defined shapes and dimensions.",
    icon: "precision",
  },
  {
    id: "welding",
    tag: "Welding",
    title: "Welding & Component Assembly",
    body: "Welding, robotic welding and resistance spot welding support the joining of metallic parts and the manufacture of functional sub-assemblies.",
    icon: "work",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering-Led Production",
    body: "Engineering and design capabilities help translate component requirements into practical manufacturing solutions, supporting manufacturability and production efficiency.",
    icon: "schema",
  },
  {
    id: "oem",
    tag: "OEM",
    title: "OEM-Focused Manufacturing",
    body: "Our experience with motorcycle component production supports collaboration with local manufacturers and assembly partners, with attention to application-specific specifications and production needs.",
    icon: "car",
  },
  {
    id: "improvement",
    tag: "Improvement",
    title: "Continuous Manufacturing Improvement",
    body: "Visual management, standardized work sheets, Kanban, 5S, Kaizen and structured problem-solving methods support organized production and ongoing process improvement.",
    icon: "expand",
  },
  {
    id: "local",
    tag: "Local Value",
    title: "Supporting Local Value Addition",
    body: "By manufacturing automotive metallic components locally, Thimark contributes to Sri Lanka\u2019s industrial capability and the development of a stronger domestic automotive supply chain.",
    icon: "factory",
  },
];

export const CLOSING_PHRASES = [
  "Engineering.",
  "Manufacturing Discipline.",
  "Production Capability.",
] as const;
