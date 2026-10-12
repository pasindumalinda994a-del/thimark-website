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
  body: "At Thimark, we bring these elements together through product development, reverse engineering, and surface finishing services. Whether you are developing something new, recreating an existing component, or looking for the right finish, we help bridge the gap between engineering intent and manufacturing reality.",
  supporting: [
    "Engineering expertise.",
    "Practical solutions.",
    "Manufacturing built around your needs.",
  ],
  cta: { label: "Discuss Your Project", href: "/enquire" },
  secondary: { label: "Explore Our Services", href: "#new-product-development" },
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
    "Our New Product Development capabilities help transform concepts and requirements into practical engineering solutions. By considering design intent, manufacturability, performance, and production needs throughout the development journey, we work to ensure that ideas are not only technically considered but also ready for manufacturing.",
  ],
  readoutLabel: "Step",
  tabsLabel: "Our development journey",
  statement:
    "From the first concept to the first inspected component, our focus is on helping customers develop solutions that are practical to manufacture and aligned with their requirements.",
};

export const NPD_CTA: Link = {
  label: "Start Your Product Development Project",
  href: "/enquire",
};

// Step photography is provisional until dedicated engineering shots are available.
export const NPD_STEPS: readonly Stage[] = [
  {
    id: "research",
    label: "Research",
    title: "Research",
    body: "Understand the requirement, intended application, and key design considerations to establish a clear foundation for development.",
    operations: ["Requirement", "Application", "Design considerations"],
    icon: "expand",
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
    body: "Translate concepts and specifications into detailed three-dimensional models that help visualize product geometry, dimensions, and component relationships.",
    operations: ["Geometry", "Dimensions", "Component relationships"],
    icon: "schema",
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
    body: "Evaluate designs with manufacturing and assembly in mind, identifying opportunities to simplify production, improve practicality, and support efficient assembly.",
    operations: ["Manufacturability", "Assembly", "Simplification"],
    icon: "factory",
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
    body: "Use engineering simulation and virtual evaluation, where applicable, to assess design behaviour and identify potential issues before physical production.",
    operations: ["Virtual evaluation", "Design behaviour", "Issue detection"],
    icon: "electrical",
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
    icon: "work",
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
    body: "Inspect the initial manufactured component against the applicable specifications to evaluate conformity before proceeding to further production stages.",
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
  lede: "Sometimes the solution already exists in physical form. It may be an existing component that needs to be recreated, a part without complete technical drawings, or a design that needs to be better understood before further development.",
  storyLabel: "From Existing Part to New Possibilities",
  storyMeta: "Physical \u2192 Digital",
  paragraphs: [
    "Thimark\u2019s reverse engineering capabilities help transform physical components and existing designs into usable engineering information. Through 3D scanning, digital modelling, simulation, and design evaluation, we help customers move from a physical reference to a digital foundation for manufacturing or improvement.",
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
  cta: { label: "Discuss a Reverse Engineering Requirement", href: "/enquire" } satisfies Link,
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
    icon: "expand",
  },
  {
    id: "digitization",
    title: "Physical Sample Digitization",
    body: "Use physical samples as engineering references when developing digital representations of existing parts.",
    icon: "precision",
  },
  {
    id: "point-cloud",
    title: "Point-Cloud-to-CAD Conversion",
    body: "Translate scanned geometric data into CAD models that can support design review, modification, and manufacturing preparation.",
    icon: "schema",
  },
  {
    id: "simulation",
    title: "Simulation & Design Evaluation",
    body: "Assess reconstructed or modified designs using appropriate simulation and engineering methods, where applicable.",
    icon: "electrical",
  },
  {
    id: "optimization",
    title: "Design Optimization",
    body: "Explore opportunities to improve component geometry, manufacturability, or functional design while considering the original application and requirements.",
    icon: "work",
  },
];

/* ---- 03 Surface Finishing ------------------------------------------ */

export const FINISHING = {
  index: "03",
  eyebrow: "Surface Finishing Solutions",
  heading: ["The Right Finish.", "Applied with Purpose."],
  lede: [
    "Surface finishing plays an important role in a component\u2019s appearance, surface condition, and suitability for its intended application.",
    "Through our surface finishing offering associated with the Ekala facility, Thimark provides a range of finishing processes for metallic components. From powder coating to specialist electroplating, the available processes support different finishing requirements based on the component, its application, and the specified finish.",
  ],
  servicesLabel: "Our Finishing Services",
  processLabel: "Process & Environment",
  statement:
    "The appropriate finish and process should be selected according to the component material, intended use, customer specifications, and applicable performance requirements.",
  cta: { label: "Enquire About Surface Finishing", href: "/enquire" } satisfies Link,
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
    lead: "A coating solution for metallic components where a durable, uniform finish and the desired appearance are important considerations.",
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
    lead: "An electrodeposition coating process used to apply a coating to suitable components, according to the required application and process specifications.",
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
    lead: "An electroplated finish that provides a black appearance and can be specified for components requiring a particular surface finish and corrosion-protection performance.",
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
    lead: "A chromium electroplating process used for applications where the specified surface properties and functional requirements call for a hard chromium finish.",
  },
];

export const PRETREATMENT = {
  label: "An Integrated Pre-Treatment Process",
  stages: 11,
  stagesLabel: "Stage Dip Pre-Treatment",
  paragraphs: [
    "A finishing result begins before the coating or plating is applied. The documented Ekala facility configuration includes an 11-stage dip pre-treatment system, designed to prepare components for subsequent finishing operations.",
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
    "At Thimark, engineering services are supported by manufacturing knowledge and a practical understanding of how components are developed, prepared, and produced. This connection helps us consider manufacturability early, evaluate design options, and support a more informed transition from engineering development to production.",
    "By bringing engineering, manufacturing, and quality considerations together, Thimark helps customers approach product development and component requirements with a clearer path from concept to production.",
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
    "The objective is to identify requirements early, assess conformity at appropriate stages, and support consistent results throughout the manufacturing process.",
  ],
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "3D modelling, parametric design, engineering documentation, and Design for Manufacturing and Assembly help translate requirements into practical component designs.",
    icon: "schema",
  },
  {
    id: "simulation",
    tag: "Simulation",
    title: "Simulation & Design Evaluation",
    body: "Virtual prototyping, kinematic simulation, and appropriate engineering analysis help evaluate designs and explore potential improvements before committing to physical production.",
    icon: "electrical",
  },
  {
    id: "tooling",
    tag: "Tooling",
    title: "Tooling & Prototyping",
    body: "Tooling, jig and fixture design, and prototyping support the evaluation of component fit, assembly, and manufacturing feasibility.",
    icon: "work",
  },
  {
    id: "digitization",
    tag: "Digitization",
    title: "Reverse Engineering & Digitization",
    body: "3D scanning and point-cloud-to-CAD workflows help convert physical references into digital engineering models for further evaluation and development.",
    icon: "expand",
  },
  {
    id: "finishing",
    tag: "Finishing",
    title: "Surface Finishing Capabilities",
    body: "A range of coating and electroplating processes supports finishing requirements for metallic components, subject to the applicable process specifications and facility capabilities.",
    icon: "factory",
  },
  {
    id: "quality",
    tag: "Quality",
    title: "Quality Assurance & Inspection",
    body: "Material verification, review of material certificates, inspection using calibrated instruments, and first-article and final inspections as applicable.",
    icon: "verified",
  },
];

export const CLOSING_PHRASES = ["Engineering.", "Manufacturing.", "Quality."] as const;
