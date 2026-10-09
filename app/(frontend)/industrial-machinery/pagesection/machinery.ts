import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type { Capability } from "@/app/(frontend)/homesections/CapabilitiesSection";

type Media = { src: string; alt: string; objectPosition?: string };

const KILGHARRAH_PHOTO = "/Gallery Images/Kilgharrah600-H4eS3WLBj1Hf5xwZhFBNSw.jpg";

/* ---- Hero ---------------------------------------------------------- */

export const HERO = {
  eyebrow: "Industrial Machinery Design & Manufacturing",
  heading: ["Engineering Solutions for", "Complex Industrial Challenges."],
  intro:
    "From specialized hydraulic equipment to custom industrial machinery, Thimark designs and manufactures engineering solutions for demanding applications across hydropower, water management, construction and industry.",
  body: "Combining mechanical engineering, heavy fabrication and practical problem-solving, we transform operational requirements into purpose-built machinery designed around the challenges our customers face.",
  disciplinesLabel: "Disciplines",
  disciplines: ["Custom Engineering", "Industrial Machinery", "Heavy Fabrication", "Automation"],
  media: {
    src: KILGHARRAH_PHOTO,
    alt: "The Kilgharrah 600 mobile hydraulic trash rack cleaner, built by Thimark, on test at the Kadawatha works",
    objectPosition: "50% 55%",
  } satisfies Media,
  caption: ["Fig. 01", "Kilgharrah 600 \u2014 KenGen, Kenya"],
  primary: { label: "Request a Quote", href: "/enquire" },
  secondary: { label: "Explore Our Solutions", href: "#products-services" },
  next: { label: "Products & Services", index: "01" },
} as const;

/* ---- 01 Products & Services ---------------------------------------- */

export const PRODUCTS = {
  index: "01",
  eyebrow: "What We Engineer",
  heading: ["Built Around the Work", "That Needs to Be Done."],
  lede: "Every industrial application comes with its own operational demands. Thimark develops specialized machinery and mechanical systems to address these requirements, combining engineering knowledge with manufacturing and fabrication expertise.",
  mediaLabel: "Application",
  listLabel: "Product Categories",
  statement: ["Developed around the function", "they need to perform."],
  aside:
    "From water management infrastructure to industrial material handling, our solutions are developed around the function they need to perform.",
  cta: { label: "Discuss Your Application", href: "/enquire" },
} as const;

export type ProductCategory = {
  id: string;
  title: string;
  body: string;
  items: readonly string[];
  pull?: string;
  media: Media;
};

export const CATEGORIES: readonly ProductCategory[] = [
  {
    id: "hydropower",
    title: "Hydropower & Water Management Equipment",
    body: "Specialized mechanical equipment for water infrastructure and hydropower applications, designed to support reliable operation and maintenance.",
    items: [
      "Automated hydraulic trash-cleaning systems",
      "Trash racks and automated rotary trash screens",
      "Sludge scrapers",
      "Sluice gates and penstock gates",
    ],
    media: {
      src: "/home-images/about-international-engineering.jpeg",
      alt: "Engineers inspecting automated trash screens at a hydropower intake",
      objectPosition: "40% 50%",
    },
  },
  {
    id: "material-handling",
    title: "Industrial Machinery & Material Handling",
    body: "Mechanical systems and custom-built machinery developed to support industrial processes, material movement and operational requirements.",
    items: [
      "Pneumatic conveyors",
      "Industrial machinery and mechanical systems",
      "Customized material-handling solutions",
    ],
    media: {
      src: "/home-images/about-industrial-automation.jpeg",
      alt: "Engineers commissioning an automated material-handling line",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "filtration",
    title: "Dust Collection & Filtration Systems",
    body: "Engineered filtration equipment for industrial environments, designed around application requirements and the needs of the production process.",
    items: [
      "Dust bag filters",
      "Custom-engineered filtration systems",
      "Application-specific mechanical assemblies",
    ],
    media: {
      src: "/home-images/two-core-machinery.jpeg",
      alt: "Engineers inspecting a custom process machine on the factory floor",
      objectPosition: "60% 50%",
    },
  },
  {
    id: "custom",
    title: "Custom Engineering & Fabrication",
    body: "Not every industrial challenge can be solved with standard equipment. Thimark also undertakes customized mechanical engineering and fabrication requirements based on specific project needs.",
    items: [],
    pull: "From individual fabricated components to specialized machinery, the solution starts with understanding the application.",
    media: {
      src: "/home-images/about-steel-fabrication.jpeg",
      alt: "Fabricators welding a heavy steel beam in the Thimark workshop",
      objectPosition: "50% 55%",
    },
  },
];

/* ---- 02 Featured Project — Kilgharrah 600 -------------------------- */

export const FEATURED = {
  index: "02",
  eyebrow: "Featured Project \u00b7 Kenya",
  heading: ["Kilgharrah 600 \u2014", "Engineering Beyond Conventional Solutions."],
  lede: "Some engineering challenges demand more than standard machinery. They demand a solution designed around the environment, the operation and the task itself.",
  mediaLabel: "Fig. 03 \u00b7 Mobile Hydraulic Trash Rack Cleaner",
  briefLabel: "Project Brief",
  media: {
    src: "/home-images/featured-kilgharrah.png",
    alt: "The Kilgharrah 600 clearing debris from a hydropower trash rack as engineers supervise",
    objectPosition: "50% 45%",
  } satisfies Media,
  callout: ["KenGen", "Hydropower"],
  numeral: "600",
  lead: "Developed and manufactured by Thimark Technocreations for the Kenya Electricity Generating Company (KenGen), the Kilgharrah 600 is a mobile hydraulic trash rack cleaning machine designed for hydropower plant applications.",
  paragraphs: [
    "Integrating hydraulic technology, custom controls, heavy fabrication and mobile adaptability, the machine automates trash-rack cleaning to support operational efficiency, safety and maintenance performance.",
    "The project represents a significant milestone in Thimark\u2019s development of advanced automation and its ability to deliver specialized engineering solutions beyond Sri Lanka.",
  ],
  /** Paragraph that carries the international marker. */
  highlight: 1,
  elementsLabel: "Key Engineering Elements",
  credit: { label: "Project Collaboration", value: "Varomatech Ltd, Kenya" },
  tags: ["Client \u00b7 KenGen", "Site \u00b7 Hydropower Plant", "Built \u00b7 Kadawatha, Sri Lanka"],
  cta: { label: "Explore the Kilgharrah 600 Project", href: "/gallery" },
} as const;

export type Tile = { id: string; title: string; body?: string; icon: IsoIcon };

export const ELEMENTS: readonly Tile[] = [
  { id: "hydraulic", title: "Mobile Hydraulic Cleaning System", icon: "forklift" },
  { id: "controls", title: "Custom Control Integration", icon: "electrical" },
  { id: "fabrication", title: "Heavy Steel Fabrication", icon: "work" },
  { id: "adaptability", title: "Adaptability for Different Site Conditions", icon: "expand" },
];

/* ---- 03 Approach --------------------------------------------------- */

export const APPROACH = {
  index: "03",
  eyebrow: "Our Approach",
  heading: ["The Right Solution Starts", "With the Right Understanding."],
  lede: "Industrial machinery is only as useful as its ability to solve the problem it was designed for.",
  railLabel: "From Requirement to Solution",
  lead: "At Thimark, the focus is on understanding the intended application and developing a practical engineering response, whether that means manufacturing from an existing drawing or creating specialized equipment for a specific operational challenge.",
  pathsLabel: "Two Starting Points",
  paths: [
    { id: "A", from: "Existing drawing", to: "Manufacture" },
    { id: "B", from: "Operational challenge", to: "Specialized equipment" },
  ],
} as const;

export const STEPS: readonly (Tile & { body: string; short: string })[] = [
  {
    id: "understand",
    short: "Understand",
    title: "Understand the Application",
    body: "Identify the operational challenge, site conditions, functional requirements and project objectives.",
    icon: "expand",
  },
  {
    id: "develop",
    short: "Develop",
    title: "Develop the Engineering Approach",
    body: "Establish the appropriate mechanical solution around the application, technical requirements and available specifications.",
    icon: "schema",
  },
  {
    id: "manufacture",
    short: "Manufacture",
    title: "Manufacture & Fabricate",
    body: "Apply engineering and manufacturing expertise to produce the required machinery, systems and fabricated assemblies.",
    icon: "work",
  },
  {
    id: "quality",
    short: "Quality",
    title: "Focus on Quality",
    body: "Maintain a focus on manufacturing consistency, quality requirements and the intended function of the finished solution.",
    icon: "verified",
  },
];

/* ---- 04 Exports ---------------------------------------------------- */

export const EXPORTS = {
  index: "04",
  eyebrow: "Sri Lankan Engineering \u00b7 International Applications",
  heading: ["Engineering Made in Sri Lanka.", "Built for Challenges Beyond Borders."],
  lede: "Thimark\u2019s engineering capabilities are not limited to local manufacturing requirements.",
  routeLabel: "Route \u00b7 Kadawatha \u2192 Kenya",
  highlightLabel: "International Project Highlight",
  route: {
    origin: { name: "Kadawatha", country: "Sri Lanka", coords: "7.00\u00b0N \u00b7 79.95\u00b0E" },
    destination: { name: "Nairobi", country: "Kenya", coords: "1.29\u00b0S \u00b7 36.82\u00b0E" },
    caption: "Indian Ocean crossing",
  },
  lead: "Through its collaboration on the Kilgharrah 600 project for Kenya Electricity Generating Company (KenGen), Thimark demonstrated its ability to design and manufacture specialized machinery for an international hydropower application.",
  paragraphs: [
    "Delivered in collaboration with Varomatech Ltd, Kenya, the project marked an important step in Thimark\u2019s international engineering journey and showcased the potential of Sri Lankan manufacturing expertise in demanding industrial environments.",
    "For Thimark, international projects represent more than geographical expansion. They are opportunities to apply engineering knowledge, develop technical capabilities and demonstrate what locally developed industrial solutions can achieve.",
  ],
  facts: [
    { id: "region", label: "Region", value: "Kenya \u2014 Hydropower Engineering" },
    { id: "client", label: "Client", value: "Kenya Electricity Generating Company (KenGen)" },
    {
      id: "solution",
      label: "Solution",
      value: "Kilgharrah 600 mobile hydraulic trash rack cleaning machine",
    },
    {
      id: "focus",
      label: "Engineering Focus",
      value: "Hydraulic systems, custom controls, heavy fabrication and automation.",
    },
  ],
  statement: [
    "Our ambition is to keep developing engineering solutions that create value locally",
    "and meet industrial needs internationally.",
  ],
  stamp: { strong: "Made in Sri Lanka", sub: "Kadawatha \u00b7 Est. 2014" },
} as const;

/* ---- 05 Capabilities ----------------------------------------------- */

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
    body: "Engineering expertise focused on developing practical solutions for industrial applications.",
    icon: "schema",
  },
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Proven fabrication capability developed through years of mechanical engineering and industrial projects.",
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

export const CAPABILITIES_CTA = { label: "About Thimark", href: "/about" } as const;
