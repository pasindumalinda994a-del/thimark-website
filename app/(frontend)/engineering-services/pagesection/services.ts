import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type { Capability } from "@/app/(frontend)/homesections/CapabilitiesSection";

type Media = { src: string; alt: string; objectPosition?: string };

export type ServiceTile = {
  id: string;
  title: string;
  body: string;
  icon: IsoIcon;
  short: string;
};

/* ---- Hero ---------------------------------------------------------- */

export const HERO = {
  eyebrow: "Engineering \u00b7 Product Development \u00b7 Surface Finishing",
  heading: ["From Engineering Ideas", "to Manufacturing Reality."],
  intro:
    "Every great product begins with a requirement. Turning that requirement into a reliable, manufacturable component takes the right engineering knowledge, practical manufacturing expertise and attention to detail.",
  body: [
    "At Thimark, we support businesses through new product development, reverse engineering and powder coating services \u2014 helping transform concepts into components and give manufactured products their finished form.",
    "Whether you\u2019re developing something new, working from an existing component or looking for a powder coating partner for your next production batch, we\u2019re ready to understand your requirements.",
  ],
  servicesLabel: "Services",
  services: ["New Product Development", "Reverse Engineering", "Powder Coating"],
  media: {
    src: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    objectPosition: "50% 42%",
  } satisfies Media,
  caption: ["Fig. 01", "Thimark Workshop \u00b7 Kadawatha"],
  primary: { label: "Discuss Your Requirement", href: "/enquire" },
  secondary: { label: "Explore Our Services", href: "#powder-coating" },
  next: { label: "Powder Coating", index: "01" },
} as const;

/* ---- 01 Powder Coating --------------------------------------------- */

export const POWDER = {
  index: "01",
  eyebrow: "Powder Coating",
  heading: ["A Better Finish", "for Every Component."],
  lede: "A component\u2019s quality is not only about how it is manufactured. Its surface finish also plays an important role in its appearance, protection and suitability for its intended application.",
  whoLabel: "Who Is This Service For?",
  whoIntro:
    "Thimark\u2019s powder coating inquiry service is designed for fabricators, manufacturers and industrial businesses looking for coating services for their metal components and fabricated products.",
  who: [
    "Industrial fabricators and metalworking businesses",
    "Manufacturers requiring coated components",
    "Businesses with recurring batch-finishing requirements",
    "Companies looking to outsource surface finishing",
  ],
  howLabel: "How to Get Started",
  howIntro:
    "Whether you have a one-time batch or a recurring production requirement, share your component details and finishing expectations so our team can evaluate your needs.",
  how: [
    "Tell us what components need coating.",
    "Share quantities, dimensions and finish requirements.",
    "Upload photographs or technical drawings.",
    "Our team reviews the details and follows up about your quotation.",
  ],
  statement: [
    "Need a Powder Coating Quote?",
    "Share your batch details and finishing requirements with our team.",
  ],
  cta: { label: "Request a Powder Coating Quote", href: "/enquire?service=powder-coating" },
} as const;

export const POWDER_OFFERINGS: readonly ServiceTile[] = [
  {
    id: "protection",
    short: "Protection",
    title: "Protective Surface Finishing",
    body: "Explore coating requirements suited to your components, intended application and desired surface finish.",
    icon: "verified",
  },
  {
    id: "colour",
    short: "Colour",
    title: "Colour & Finish Requirements",
    body: "Specify your preferred colour, gloss level or finish, including a RAL colour reference where available.",
    icon: "precision",
  },
  {
    id: "batch",
    short: "Batch",
    title: "Batch Coating for Fabricated Components",
    body: "Share your component types, batch quantities, dimensions and production frequency to help us assess the requirement.",
    icon: "factory",
  },
];

/* ---- 02 New Product Development ------------------------------------ */

export const NPD = {
  index: "02",
  eyebrow: "New Product Development",
  heading: ["Have an Idea?", "Let\u2019s Engineer It Into a Product."],
  lede: "Developing a new product involves more than an initial concept. It requires a clear understanding of its purpose, technical requirements, materials and how it can ultimately be manufactured.",
  railLabel: "From Concept to Component",
  lead: "Thimark brings engineering and manufacturing expertise together to help businesses explore new component and product requirements.",
  support:
    "Whether you\u2019re starting with an initial concept, a reference sample or a technical drawing, the first step is understanding what the product needs to achieve.",
  bringLabel: "What Can You Bring to the Table?",
  bring: [
    "A new product concept or sketch",
    "A component design that needs manufacturing",
    "A drawing or CAD model",
    "A sample product or assembly",
    "A requirement for a new component or improved design",
  ],
  statement: [
    "You don\u2019t need every technical detail finalized.",
    "Tell us what you\u2019re trying to develop. We\u2019ll help you establish the next steps.",
  ],
  cta: { label: "Discuss a New Product", href: "/enquire" },
} as const;

export const NPD_STEPS: readonly ServiceTile[] = [
  {
    id: "concept",
    short: "Concept",
    title: "Understand the Concept",
    body: "Share the product idea, its intended application and the problem it needs to solve.",
    icon: "expand",
  },
  {
    id: "requirements",
    short: "Requirements",
    title: "Define the Requirements",
    body: "Establish the expected function, dimensions, material preferences, operating conditions and other technical requirements.",
    icon: "schema",
  },
  {
    id: "approach",
    short: "Approach",
    title: "Evaluate the Manufacturing Approach",
    body: "Explore how the product or component could be manufactured, taking account of its design and intended use.",
    icon: "work",
  },
  {
    id: "next",
    short: "Next Step",
    title: "Define the Next Step",
    body: "Discuss the appropriate next stage for your requirement, whether it involves further engineering, a prototype or a manufacturing quotation.",
    icon: "precision",
  },
];

/* ---- 03 Reverse Engineering ---------------------------------------- */

export const REVERSE = {
  index: "03",
  eyebrow: "Reverse Engineering",
  heading: ["Starting With What Exists.", "Engineering What Comes Next."],
  lede: "Sometimes the product you need already exists \u2014 but the original drawings, CAD files or manufacturing information are no longer available.",
  supportLabel: "How It Can Support Your Requirement",
  lead: "Reverse engineering begins with understanding an existing component or product and documenting its relevant physical and functional characteristics to inform further engineering or manufacturing work.",
  mediaLabel: "Fig. 02 \u00b7 Inspection",
  media: {
    src: "/home-images/quality-inspection.jpeg",
    alt: "Engineer inspecting a machined metal component with a digital caliper",
    objectPosition: "62% 35%",
  } satisfies Media,
  caption: ["Fig. 02", "Dimensional Inspection"],
  whenLabel: "When Might You Need It?",
  whenIntro:
    "For businesses working with legacy parts, replacement components or existing mechanical assemblies, this can provide a starting point for evaluating how a component may be reproduced or developed further.",
  when: [
    "Original component drawings are unavailable.",
    "You need to investigate the reproduction of an existing part.",
    "You have a physical sample but no CAD model.",
    "A legacy component needs to be documented for future manufacturing.",
    "You need to assess a replacement part or an existing design.",
  ],
  provideLabel: "What Should You Provide?",
  provideIntro: "If possible, include:",
  provide: [
    "The original component or clear photographs",
    "Available dimensions and measurements",
    "Information about the component\u2019s function",
    "Material or grade information, if known",
    "Any relevant assembly drawings or reference documents",
  ],
  statement: [
    "Don\u2019t have the original drawing?",
    "Start with the component you have.",
  ],
  cta: { label: "Discuss Reverse Engineering", href: "/enquire" },
} as const;

export const REVERSE_STEPS: readonly { id: string; title: string; body: string }[] = [
  {
    id: "inspect",
    title: "Inspect the Existing Component",
    body: "Provide the original part, photographs, available measurements or related assembly information.",
  },
  {
    id: "details",
    title: "Establish the Technical Details",
    body: "Identify the dimensions, geometry, interfaces, material information and functional requirements that need to be understood.",
  },
  {
    id: "evaluate",
    title: "Evaluate the Engineering Requirements",
    body: "Determine what additional inspection, measurements, drawings or technical information would be required to proceed.",
  },
  {
    id: "explore",
    title: "Explore Manufacturing or Replacement",
    body: "Use the agreed technical information to evaluate a suitable next step for component development, reproduction or manufacturing.",
  },
];

/* ---- 04 Capabilities ----------------------------------------------- */

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Quality-controlled production processes designed for accuracy, reliability and consistency.",
    icon: "precision",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "Engineering expertise focused on developing practical solutions for automotive and industrial applications.",
    icon: "schema",
  },
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Fabrication capability developed through years of mechanical engineering and industrial projects.",
    icon: "work",
  },
  {
    id: "machinery",
    tag: "Machinery",
    title: "Industrial Machinery",
    body: "Design and manufacture of customized machinery and mechanical systems.",
    icon: "forklift",
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Automation & Custom Solutions",
    body: "Integration of mechanical, hydraulic and control technologies to address specialized industrial challenges.",
    icon: "electrical",
  },
  {
    id: "quality",
    tag: "Quality",
    title: "Quality Management",
    body: "An ISO 9001:2015-certified quality management system supporting consistent manufacturing practices.",
    icon: "verified",
  },
];

export const CAPABILITIES_CTA = { label: "Discuss a Requirement", href: "/enquire" } as const;
