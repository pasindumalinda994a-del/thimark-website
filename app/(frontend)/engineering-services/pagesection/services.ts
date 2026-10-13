import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type { HeroCopy } from "@/app/(frontend)/about/pagesection/AboutHero";
import type { QualityCopy } from "@/app/(frontend)/about/pagesection/QualitySection";
import type { Stage } from "@/app/(frontend)/automotive/pagesection/automotive";
import type { ProcessCopy } from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import type {
  Capability,
  CapabilitiesCopy,
} from "@/app/(frontend)/homesections/CapabilitiesSection";

type Link = { label: string; href: string };
type Media = { src: string; alt: string; objectPosition: string };

/* ---- Hero ---------------------------------------------------------- */

export const HERO: HeroCopy = {
  eyebrow: "Engineering \u00b7 Reverse Engineering \u00b7 Surface Finishing",
  heading: ["From Concept to", "Production-Ready Solutions."],
  intro:
    "Every great product begins with a requirement. Turning that requirement into a manufacturable, reliable solution takes engineering knowledge, practical design, and the right production capabilities.",
  body: "Through product development, reverse engineering and surface finishing, we help turn a new idea, an existing component or a required finish into something ready to manufacture.",
  supporting: [
    "Engineering expertise.",
    "Practical solutions.",
    "Manufacturing built around your needs.",
  ],
  cta: { label: "Discuss an Engineering Project", href: "/enquire?service=engineering" },
  secondary: { label: "See Our Services", href: "#new-product-development" },
  image: {
    src: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    objectPosition: "50% 42%",
  },
  caption: ["Fig. 01", "Thimark Workshop \u00b7 Kadawatha"],
};

/* ---- 01 New Product Development ------------------------------------ */

export const NPD: ProcessCopy = {
  index: "01",
  eyebrow: "From Idea to Reality",
  heading: ["Turning Ideas into Products", "Built for the Real World."],
  lede: [
    "A promising idea becomes a successful product when it can be designed, manufactured, tested, and produced consistently.",
    "New Product Development turns concepts into practical solutions, keeping design intent, manufacturability, performance and production in view so ideas are ready to make.",
  ],
  readoutLabel: "Step",
  tabsLabel: "Our development journey",
  statement:
    "From first concept to first inspected component, we help develop solutions that are practical to manufacture and aligned with the requirement.",
};

export const NPD_CTA: Link = {
  label: "Start a Development Project",
  href: "/enquire?service=engineering",
};

// Step photography is provisional until dedicated engineering shots are available.
export const NPD_STEPS: readonly Stage[] = [
  {
    id: "research",
    label: "Research",
    title: "Research",
    body: "Understand the requirement, intended application, and key design considerations to establish a clear foundation for development.",
    operations: ["Requirement", "Application", "Design considerations"],
    icon: "research",
    media: {
      src: "/home-images/about-international-engineering.jpeg",
      alt: "Engineers reviewing an installed system on site to understand its application",
      objectPosition: "55% 45%",
    },
  },
  {
    id: "modelling",
    label: "3D Modelling",
    title: "3D Modelling",
    body: "Translate concepts and specifications into three-dimensional models of geometry, dimensions and component relationships.",
    operations: ["Geometry", "Dimensions", "Component relationships"],
    icon: "model3d",
    media: {
      src: "/home-images/about-iso-precision.jpeg",
      alt: "Engineers checking a gear assembly against its technical drawings",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "dfma",
    label: "DFMA",
    title: "Design for Manufacturing and Assembly",
    body: "Evaluate designs for manufacturing and assembly, to simplify production and support efficient assembly.",
    operations: ["Manufacturability", "Assembly", "Simplification"],
    icon: "conveyor",
    media: {
      src: "/home-images/quality-lean-production.jpeg",
      alt: "Operators assembling components along an organized assembly line",
      objectPosition: "40% 45%",
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    title: "Simulation",
    body: "Use simulation, where applicable, to assess design behaviour and find issues before physical production.",
    operations: ["Virtual evaluation", "Design behaviour", "Issue detection"],
    icon: "monitoring",
    media: {
      src: "/home-images/about-industrial-automation.jpeg",
      alt: "Engineers evaluating machine behaviour on a tablet beside an automated line",
      objectPosition: "35% 50%",
    },
  },
  {
    id: "tooling",
    label: "Tooling",
    title: "Tooling Design",
    body: "Develop tooling, jigs, and fixtures to support accurate, repeatable manufacturing and assembly processes.",
    operations: ["Tooling", "Jigs", "Fixtures"],
    icon: "handyman",
    media: {
      src: "/home-images/about-steel-fabrication.jpeg",
      alt: "Fabricators welding steel assemblies held in workshop fixtures",
      objectPosition: "50% 45%",
    },
  },
  {
    id: "prototyping",
    label: "Prototyping",
    title: "Prototyping",
    body: "Move from digital design to physical prototypes to evaluate fit, form, function, and manufacturing feasibility.",
    operations: ["Fit", "Form", "Function", "Feasibility"],
    icon: "precision",
    media: {
      src: "/home-images/two-core-automotive.jpeg",
      alt: "Engineers assembling a physical prototype frame on the workshop floor",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "inspection",
    label: "FAI",
    title: "First Article Inspection",
    body: "Inspect the first manufactured component against specifications before further production.",
    operations: ["Specifications", "Conformity", "Production release"],
    icon: "verified",
    media: {
      src: "/home-images/quality-inspection.jpeg",
      alt: "Engineer inspecting a machined metal component with a digital caliper",
      objectPosition: "62% 35%",
    },
  },
];

/* ---- 02 Reverse Engineering ---------------------------------------- */

export const REVERSE = {
  index: "02",
  eyebrow: "Understand. Recreate. Improve.",
  heading: ["Bringing Existing Components", "Back into Focus."],
  lede: "Sometimes the solution already exists \u2014 a component to recreate, a part without complete drawings, or a design to understand before further development.",
  storyLabel: "From Existing Part to New Possibilities",
  storyMeta: "Physical \u2192 Digital",
  paragraphs: [
    "Reverse engineering turns physical components into usable engineering information, through 3D scanning, digital modelling, simulation and design evaluation.",
    "Reverse engineering can help establish a digital reference for legacy components, support the recreation of parts, and provide a starting point for design improvements.",
  ],
  media: {
    src: "/home-images/quality-continuous-improvement.jpeg",
    alt: "Engineers measuring an existing housing with calipers against its technical drawings",
    objectPosition: "45% 55%",
  } satisfies Media,
  capabilitiesLabel: "Our Reverse Engineering Capabilities",
  closing:
    "It connects physical products with the engineering information needed to understand, modify, and manufacture them.",
  cta: { label: "Discuss Reverse Engineering", href: "/enquire?service=engineering" } satisfies Link,
} as const;

export const REVERSE_CAPABILITIES: readonly {
  id: string;
  title: string;
  body: string;
  icon: IsoIcon;
}[] = [
  {
    id: "scanning",
    title: "3D Scanning",
    body: "Capture the geometry of existing components to support detailed digital analysis and reconstruction.",
    icon: "scan",
  },
  {
    id: "digitization",
    title: "Physical Sample Digitization",
    body: "Use physical samples as engineering references when developing digital representations of existing parts.",
    icon: "dataset",
  },
  {
    id: "point-cloud",
    title: "Point-Cloud-to-CAD Conversion",
    body: "Translate scanned geometric data into CAD models that can support design review, modification, and manufacturing preparation.",
    icon: "scatter",
  },
  {
    id: "simulation",
    title: "Simulation & Design Evaluation",
    body: "Assess reconstructed or modified designs using appropriate simulation and engineering methods, where applicable.",
    icon: "monitoring",
  },
  {
    id: "optimization",
    title: "Design Optimization",
    body: "Explore ways to improve geometry, manufacturability or function while keeping the original application in view.",
    icon: "sliders",
  },
];

/* ---- 03 Surface Finishing ------------------------------------------ */

export const FINISHING = {
  index: "03",
  eyebrow: "Surface Finishing Solutions",
  heading: ["The Right Finish.", "Applied with Purpose."],
  lede: [
    "Surface finishing plays an important role in a component\u2019s appearance, surface condition, and suitability for its intended application.",
    "Through the Ekala facility, we finish metallic components \u2014 from powder coating to specialist electroplating \u2014 matched to the part, its application and the specified finish.",
  ],
  servicesLabel: "Our Finishing Services",
  processLabel: "Process & Environment",
  statement:
    "The appropriate finish and process should be selected according to the component material, intended use, customer specifications, and applicable performance requirements.",
  cta: { label: "Enquire About Finishing", href: "/enquire?service=finishing" } satisfies Link,
} as const;

export type Finish = {
  id: string;
  label: string;
  callout: readonly [string, string];
  imageSide: "left" | "right";
  media: Media;
  lead: string;
};

// Finish photography is provisional until shots from the Ekala facility are available.
export const FINISHES: readonly Finish[] = [
  {
    id: "powder-coating",
    label: "Powder Coating",
    callout: ["Durable", "Uniform Finish"],
    imageSide: "right",
    media: {
      src: "/products/Rear Plate.png",
      alt: "Black coated steel rear plate with a textured, uniform finish",
      objectPosition: "50% 50%",
    },
    lead: "A durable, uniform coating for metallic components where appearance and finish matter.",
  },
  {
    id: "e-coating",
    label: "ED / E-Coating",
    callout: ["Electrodeposition", "Coating"],
    imageSide: "left",
    media: {
      src: "/products/Battery Bracket.png",
      alt: "Welded steel battery bracket with an even black coating",
      objectPosition: "50% 50%",
    },
    lead: "An electrodeposition process that coats suitable components to the required specification.",
  },
  {
    id: "black-zinc",
    label: "Black Zinc Electroplating",
    callout: ["Black Appearance", "Corrosion Protection"],
    imageSide: "right",
    media: {
      src: "/products/Pillion Bracket.png",
      alt: "Formed steel pillion bracket with a black finish",
      objectPosition: "50% 50%",
    },
    lead: "An electroplated black finish, specified where appearance and corrosion protection are required.",
  },
  {
    id: "hard-chromium",
    label: "Hard Chromium Electroplating",
    callout: ["Functional", "Surface Properties"],
    imageSide: "left",
    media: {
      src: "/products/Bar Pillion LH & RH.png",
      alt: "Machined pillion bar component with a finished surface",
      objectPosition: "50% 50%",
    },
    lead: "A chromium finish for applications that call for specified surface properties and a hard chromium surface.",
  },
];

export const PRETREATMENT = {
  label: "An Integrated Pre-Treatment Process",
  stages: 11,
  stagesLabel: "Stage Dip Pre-Treatment",
  paragraphs: [
    "A finish begins before coating or plating. The Ekala facility includes an 11-stage dip pre-treatment system that prepares components for finishing.",
    "Appropriate pre-treatment and process control are important to supporting coating adhesion, surface consistency, and the performance requirements defined for each application.",
  ],
} as const;

export const ENVIRONMENT = {
  label: "Environmental Controls",
  intro:
    "The facility documentation also describes environmental management provisions, including:",
  controls: [
    "Closed-loop, zero-discharge system",
    "Effluent treatment plant (ETP)",
    "Fume scrubbing",
  ],
  body: "These supporting systems form part of the facility\u2019s approach to managing finishing processes and their associated environmental considerations.",
} as const;

/* ---- 04 Engineering Capabilities & Quality ------------------------- */

export const ENGINEERING: QualityCopy = {
  index: "04",
  eyebrow: "Engineering Meets Manufacturing",
  heading: ["Better Decisions in Design.", "Greater Confidence in Production."],
  lede: "Engineering is most valuable when design decisions are connected to real manufacturing requirements.",
  headLabel: "Design to Production",
  paragraphs: [
    "Our engineering services draw on manufacturing knowledge \u2014 how components are developed, prepared and produced \u2014 so manufacturability is considered early and the path to production is clearer.",
    "Engineering, manufacturing and quality together give customers a clearer path from concept to production.",
  ],
  media: {
    src: "/home-images/two-core-machinery.jpeg",
    alt: "Engineers reviewing drawings beside custom machinery on the production floor",
    objectPosition: "70% 40%",
  },
  cred: { org: "ISO", code: "9001:2015", sub: "Documented Quality Framework" },
};

export const CAPABILITIES_COPY: CapabilitiesCopy = {
  eyebrow: "Engineering Capabilities & Quality",
  heading: ["Six Capabilities.", "One Path to Production."],
  lede: [
    "Our documented quality framework is based on ISO 9001:2015.",
    "Identify requirements early, check conformity at each stage, and keep results consistent.",
  ],
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "3D modelling and design for manufacture, into practical designs.",
    icon: "schema",
  },
  {
    id: "simulation",
    tag: "Simulation",
    title: "Simulation & Design Evaluation",
    body: "Virtual prototyping and analysis before physical production.",
    icon: "monitoring",
  },
  {
    id: "tooling",
    tag: "Tooling",
    title: "Tooling & Prototyping",
    body: "Jigs, fixtures and prototypes to prove fit and assembly.",
    icon: "handyman",
  },
  {
    id: "digitization",
    tag: "Digitization",
    title: "Reverse Engineering & Digitization",
    body: "3D scanning and point-cloud-to-CAD for digital models.",
    icon: "scan",
  },
  {
    id: "finishing",
    tag: "Finishing",
    title: "Surface Finishing Capabilities",
    body: "Coating and electroplating for metallic components.",
    icon: "coating",
  },
  {
    id: "quality",
    tag: "Quality",
    title: "Quality Assurance & Inspection",
    body: "Material certificates, calibrated instruments, and first-article and final inspection.",
    icon: "verified",
  },
];

export const CLOSING_PHRASES = ["Engineering.", "Manufacturing.", "Quality."] as const;
