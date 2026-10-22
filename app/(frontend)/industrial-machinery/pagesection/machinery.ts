import type { HeroCopy } from "@/app/(frontend)/about/pagesection/AboutHero";
import type { Stage } from "@/app/(frontend)/automotive/pagesection/automotive";
import type { ProcessCopy } from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import type {
  Capability,
  CapabilitiesCopy,
} from "@/app/(frontend)/homesections/CapabilitiesSection";

type Link = { label: string; href: string };
type Media = { src: string; alt: string; objectPosition: string };

export const ENQUIRE = "/enquire?service=industrial";

// Test: kilgharrah-R1 | R2 | R3
const KILGARRAH_PHOTO = "/pages/industrial-machinery/kilgharrah-R1.JPG.jpeg";

/* ---- Hero ---------------------------------------------------------- */

export const HERO: HeroCopy = {
  eyebrow: "Industrial Machinery Manufacturer \u00b7 Sri Lanka",
  heading: ["Custom Industrial Machinery.", "Built for Real Challenges."],
  intro:
    "Complex industrial challenges demand more than standard equipment. They require practical engineering, dependable manufacturing, and machinery designed around the realities of the application.",
  body: "From our works in Sri Lanka, we design and manufacture custom industrial machinery for water and hydropower, industrial processing and material handling \u2014 from trash rack cleaners and conveyors to heavy steel structures.",
  supporting: [
    "Engineered around the challenge.",
    "Built for the application.",
    "Made to perform.",
  ],
  cta: { label: "Discuss a Machinery Project", href: ENQUIRE },
  secondary: { label: "See Our Machinery", href: "#portfolio" },
  image: {
    // Test: hero-R1 | R2 | R3
    src: "/pages/industrial-machinery/hero-R1.JPG.jpeg",
    alt: "Engineers inspecting a custom industrial water-treatment machine",
    objectPosition: "50% 40%",
  },
  caption: ["Fig. 01", "Custom Industrial Machinery"],
};

/* ---- 01 Portfolio -------------------------------------------------- */

export const PORTFOLIO = {
  index: "01",
  eyebrow: "Solutions for Industry & Infrastructure",
  heading: ["Engineered Solutions for", "Demanding Industrial Applications."] as const,
  lede: "From hydropower intakes to dust control and material handling, the right equipment makes a meaningful difference.",
  headLabel: "Industrial Machinery Portfolio",
  headMeta: "Infrastructure \u00b7 Industry",
  paragraphs: [
    "Thimark develops and manufactures machinery and fabricated systems designed around specific operational needs.",
    "Our portfolio brings together mechanical engineering, steel fabrication, and manufacturing capabilities to support infrastructure and industrial applications.",
  ],
  media: {
    // Test: portfolio-R1 | R2 | R3
    src: "/pages/industrial-machinery/portfolio-R1.webp",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    objectPosition: "50% 42%",
  } satisfies Media,
};

export type MachineryItem = {
  name: string;
  body: string;
};

export type PortfolioBand = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  intro: string;
  items: readonly MachineryItem[];
  closing: string;
  /** Image half, matching the homepage solutions bands. */
  imageSide: "left" | "right";
  media: Media;
  caption: readonly [string, string];
};

export const BANDS: readonly PortfolioBand[] = [
  {
    id: "water-hydropower",
    index: "01",
    title: "Water & Hydropower Infrastructure",
    subtitle: "Machinery designed to support water infrastructure operations.",
    intro:
      "Our water and hydropower-related solutions include specialized equipment and fabricated systems intended for demanding water-management environments.",
    items: [
      {
        name: "KILGHARRAH 600 Hydraulic Trash Rack Cleaning Machine",
        body: "A movable hydraulic machine developed for cleaning trash racks at hydropower facilities.",
      },
      {
        name: "Automated Rotary Trash Screens & Racks",
        body: "Systems designed for debris screening applications, subject to project requirements.",
      },
      {
        name: "Sluice Gates & Penstock Gates",
        body: "Fabricated gate solutions for water-control applications.",
      },
      {
        name: "Stop Logs",
        body: "Removable barrier systems for suitable water infrastructure applications.",
      },
      {
        name: "Sludge Scrapers & Skimmers",
        body: "Equipment for sludge removal and surface-material collection in applicable treatment and processing systems.",
      },
    ],
    closing:
      "Each project differs in arrangement and integration \u2014 we start with the application and engineer around it.",
    imageSide: "right",
    media: {
      // Test: water-R1 | R2 | R3
      src: "/pages/industrial-machinery/water-R1.JPG.jpeg",
      alt: "The KILGHARRAH 600 clearing debris from a hydropower trash rack as engineers supervise",
      objectPosition: "50% 45%",
    },
    caption: ["Fig. 02", "Water & Hydropower"],
  },
  {
    id: "industrial-processing",
    index: "02",
    title: "Industrial Processing & Material Handling",
    subtitle: "Practical machinery for specialized industrial processes.",
    intro:
      "Equipment tailored to the material, the available space and the wider production process.",
    items: [
      {
        name: "Pneumatic Conveying Systems",
        body: "Equipment and system solutions for moving suitable materials through air-powered conveying arrangements.",
      },
      {
        name: "Dust Collection & Bag Filter Systems",
        body: "Solutions designed to capture and manage airborne dust in industrial applications.",
      },
      {
        name: "Special-Purpose Machinery (SPM)",
        body: "Custom machinery developed around specific operational or production requirements.",
      },
      {
        name: "Heavy Steel Structures & Tanks",
        body: "Fabricated structures and vessels designed to suit project specifications.",
      },
      {
        name: "Process Equipment & Custom Fabrication",
        body: "Engineered and fabricated components supporting industrial installations and processes.",
      },
    ],
    closing:
      "From fabricated assemblies to integrated machinery, we deliver practical solutions for real operational needs.",
    imageSide: "left",
    media: {
      // Test: processing-R1 | R2 | R3
      src: "/pages/industrial-machinery/processing-R3.webp",
      alt: "Engineers commissioning an automated conveyor and material-handling line",
      objectPosition: "50% 50%",
    },
    caption: ["Fig. 03", "Processing & Material Handling"],
  },
];

/* ---- 02 Process ---------------------------------------------------- */

export const PROCESS: ProcessCopy = {
  index: "02",
  eyebrow: "Our Engineering Approach",
  heading: ["From the First Drawing", "to a Working Solution."],
  lede: [
    "Custom machinery needs more than a concept \u2014 engineering, fabrication, controls and installation have to work as one connected process.",
    "We translate operational requirements into designs and coordinate every manufacturing stage that brings the machine to life.",
  ],
  readoutLabel: "Stage",
  tabsLabel: "Engineering stages",
  statement:
    "One connected process. From engineering intent to machinery built around the job it needs to do.",
};

export const STAGES: readonly Stage[] = [
  {
    id: "scanning",
    label: "Scanning",
    title: "Reverse Engineering & 3D Scanning",
    body: "Where existing equipment or samples are available, reverse engineering and 3D scanning capture geometry as a digital starting point for design.",
    operations: ["Geometry", "Physical samples", "Digital starting point"],
    icon: "scan",
  },
  {
    id: "cad",
    label: "CAD Design",
    title: "CAD Design & Virtual Prototyping",
    body: "Engineering models and virtual design methods help define component geometry, evaluate arrangements, and explore how the proposed machinery will fit its intended application.",
    operations: ["Component geometry", "Arrangements", "Application fit"],
    icon: "model3d",
  },
  {
    id: "fabrication",
    label: "Fabrication",
    title: "Fabrication & Manufacturing",
    body: "Cutting, forming, machining, welding and heavy steel fabrication bring the design into physical form, matched to the project\u2019s materials and specifications.",
    operations: ["Cutting", "Forming", "Welding"],
    icon: "work",
  },
  {
    id: "controls",
    label: "Controls",
    title: "Automation & Controls",
    body: "Where the project requires it, automation, hydraulic systems and PLC controls support operation and integration with the wider process.",
    operations: ["Hydraulic systems", "PLC controls", "Integration"],
    icon: "electrical",
  },
  {
    id: "commissioning",
    label: "Commissioning",
    title: "Finishing & Commissioning",
    body: "Finishing readies equipment for its environment. Where in scope, installation, commissioning and operational checks take it into service.",
    operations: ["Finishing", "Installation", "Commissioning"],
    icon: "verified",
  },
];

/* ---- 03 Featured — KILGHARRAH 600 ----------------------------------- */

export const FEATURED = {
  index: "03",
  eyebrow: "Featured Engineering Project",
  heading: ["Engineering a Better Approach", "to Trash Rack Cleaning."] as const,
  lede: "Hydropower facilities need clear intakes. Effective trash-rack cleaning keeps debris from restricting flow.",
  storyLabel: "KILGHARRAH 600 \u00b7 KenGen",
  paragraphs: [
    "Thimark designed and manufactured the KILGHARRAH 600 movable hydraulic trash rack cleaning machine for Kenya Electricity Generating Company PLC (KenGen), with Varomatech Ltd, Kenya.",
    "Developed for a hydropower facility and designed around the site, it removes accumulated debris and supports water-intake operation.",
  ],
  media: {
    src: KILGARRAH_PHOTO,
    alt: "The KILGHARRAH 600 movable hydraulic trash rack cleaner, built by Thimark, on test at the Kadawatha works",
    objectPosition: "50% 45%",
  } satisfies Media,
  caption: ["Fig. 04", "KILGHARRAH 600 \u00b7 KenGen"] as const,
  closing:
    "The KILGHARRAH 600 shows how Thimark turns specialized requirements into machinery for demanding infrastructure.",
  glanceLabel: "Project at a glance",
  glance: [
    { label: "Client", value: "Kenya Electricity Generating Company PLC (KenGen)" },
    { label: "Project", value: "KILGHARRAH 600 movable hydraulic trash rack cleaning machine" },
    { label: "Partner", value: "Varomatech Ltd, Kenya" },
    { label: "Application", value: "Hydropower infrastructure and trash rack cleaning" },
    {
      label: "Scope",
      value: "Design and manufacture, with commissioning to be stated according to verified project records",
    },
  ],
  cta: { label: "Discuss a Machinery Project", href: ENQUIRE } satisfies Link,
};

/* ---- 04 Capabilities ----------------------------------------------- */

export const CAPABILITIES_COPY: CapabilitiesCopy = {
  eyebrow: "Built on Engineering Strength",
  heading: ["The Engineering Behind", "Every Solution."],
  lede: [
    "Reliable industrial machinery depends on the relationship between design, materials, manufacturing processes, and the demands of the operating environment.",
    "Engineering and manufacturing together, for custom machinery, heavy fabrication and specialized equipment.",
  ],
};

export const CLOSING_PHRASES = ["Engineering.", "Fabrication.", "The Application."] as const;

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Steel structures, frames, tanks and assemblies built to the project.",
    icon: "work",
  },
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing & CNC Processes",
    body: "Laser cutting, press-brake work and machining for accurate parts.",
    icon: "precision",
  },
  {
    id: "welding",
    tag: "Welding",
    title: "Welding & Structural Assembly",
    body: "Welding and joining for structures and custom components.",
    icon: "flame",
  },
  {
    id: "hydraulic",
    tag: "Systems",
    title: "Mechanical & Hydraulic Systems",
    body: "Mechanical and hydraulic systems defined for each operation.",
    icon: "fluid",
  },
  {
    id: "design",
    tag: "Design",
    title: "Industrial Engineering & Design",
    body: "CAD, 3D scanning and reverse engineering for machinery design.",
    icon: "schema",
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Automation & Custom Solutions",
    body: "PLC controls and automation for the machine sequence.",
    icon: "electrical",
  },
];
