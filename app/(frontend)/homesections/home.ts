import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import { HOME_CAPABILITIES } from "@/app/(frontend)/homesections/capabilities";
import { PARTNERS } from "@/app/(frontend)/homesections/partners";
import { RAQ_LINK } from "@/app/(frontend)/components/nav";

type Link = { label: string; href: string };
type Media = { src: string; alt: string; objectPosition: string };

export type JourneyCopy = {
  index?: string;
  eyebrow: string;
  heading: readonly [string, string];
  lede: string;
  readoutLabel: string;
  readout: readonly { text: string; strong?: boolean }[];
  cta: Link;
};

export type CapabilitiesSectionCopy = {
  eyebrow: string;
  heading: readonly [string, string];
  lede: readonly string[];
};

export type PartnersSectionCopy = {
  eyebrow: string;
  heading: readonly [string, string];
  lede: { strong: string; rest: string };
  statement: string;
  cta?: Link;
};

/* ---- Hero ---------------------------------------------------------- */

export type HeroVideo = {
  webm?: string;
  mp4: string;
};

export type HeroClip = {
  id: string;
  src: HeroVideo | null;
  poster: string;
  objectPosition: string;
  label: string;
  detail: string;
  alt: string;
};

export const HERO_CLIP_DURATION = 6;

/** One source file per reel station (public Vercel Blob). */
const HERO_VIDEOS = [
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-1.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-2.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-3.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-4.mp4" },
  { mp4: "https://n0ns1ncsflgnafwq.public.blob.vercel-storage.com/hero/final/hero-5.mp4" },
] as const satisfies readonly HeroVideo[];

export const HERO = {
  eyebrow: ["Engineering", "Manufacturing", "Innovation"] as const,
  heading: ["Engineering What Moves", "Industry Forward."],
  lede: "Precision motorcycle components and custom industrial machinery from an ISO 9001:2015 engineering company in Sri Lanka.",
  primaryCta: {
    href: RAQ_LINK.href,
    label: RAQ_LINK.label,
    ariaLabel: RAQ_LINK.ariaLabel,
  },
  secondaryCta: { label: "See What We Do", href: "/#capabilities" } satisfies Link,
} as const;

export const HERO_CLIPS: HeroClip[] = [
  {
    id: "quality",
    src: HERO_VIDEOS[0],
    poster: "/pages/home/hero-quality.webp",
    objectPosition: "50% 50%",
    label: "Quality",
    detail: "Commitment to producing high quality well engineered components",
    alt: "Precision motorcycle components in production",
  },
  {
    id: "delivery",
    src: HERO_VIDEOS[1],
    poster: "/pages/home/hero-delivery.JPG.jpeg",
    objectPosition: "50% 50%",
    label: "Timely Delivery",
    detail: "Ensuring products are delivered on time",
    alt: "Custom industrial machinery in the workshop",
  },
  {
    id: "reliability",
    src: HERO_VIDEOS[2],
    poster: "/pages/home/hero-reliability.webp",
    objectPosition: "50% 45%",
    label: "Reliability",
    detail: "Providing dependable and consistent service",
    alt: "Steel fabrication in the Thimark workshop",
  },
  {
    id: "service",
    src: HERO_VIDEOS[3],
    poster: "/pages/home/hero-service.webp",
    objectPosition: "50% 50%",
    label: "Professional Service",
    detail: "Offering worry free, professional service to clients",
    alt: "Thimark engineering facility in Sri Lanka",
  },
  {
    id: "ethics",
    src: HERO_VIDEOS[4],
    poster: "/pages/home/hero-ethics.webp",
    objectPosition: "48% 40%",
    label: "Business Ethics and Integrity",
    detail: "Upholding ethical conduct and strong moral principles",
    alt: "Engineers inspecting a precision-machined gear assembly",
  },
];

/* ---- 01 Company Story ---------------------------------------------- */

export const STORY = {
  index: "01",
  eyebrow: "Built From The Ground Up",
  heading: ["From Steel Fabrication", "to Advanced Engineering."],
  lede: "From a backyard steel workshop in 2014 to a trusted Sri Lankan engineering company for automotive and industrial work.",
  storyLabel: "Our Story",
  since: "Since 2014",
  paragraphs: [
    "Over the years, Thimark has expanded its capabilities and invested in technology, turning engineering concepts, technical drawings and physical samples into precision components and custom-built machinery.",
    "Today our work spans OEM motorcycle components, heavy steel fabrication, industrial machinery, engineering development and surface finishing, brought together to solve complex manufacturing challenges.",
  ],
  media: {
    // Test: story-R1 | R2 | R3
    src: "/pages/home/story-R1.webp",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    objectPosition: "50% 50%",
  } satisfies Media,
  scopeLabel: "Our Work Today",
  scope: [
    "OEM Motorcycle Components",
    "Heavy Steel Fabrication",
    "Industrial Machinery",
    "Engineering Development",
    "Surface Finishing",
  ],
  closing:
    "A simple belief drives us: when engineering meets innovation, quality and determination, challenges become opportunities.",
  cta: { label: "See the Journey", href: "/#about" } satisfies Link,
} as const;

/* ---- 01b Journey carousel ------------------------------------------ */

export type JourneyItem = {
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

export const JOURNEY_COPY: JourneyCopy = {
  eyebrow: "Our Journey",
  heading: ["Every Milestone", "Built the Next."],
  lede: "From modest steel fabrication to a Sri Lankan engineering company delivering OEM components and custom industrial machinery.",
  readoutLabel: "Our Story",
  readout: [
    { text: "We invest in people and technology " },
    { text: "to turn engineering challenges into dependable solutions", strong: true },
    { text: "." },
  ],
  cta: { label: "See What We Do", href: "/#capabilities" },
};

export const JOURNEY: JourneyItem[] = [
  {
    id: "foundation",
    year: "2014",
    label: "Founded",
    title: "From the Ground Up",
    icon: "factory",
    // Test: journey-founded-R1 | R2 | R3
    image: "/pages/home/journey-founded-R1.webp",
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
    // Test: journey-iso-R1 | R2 | R3
    image: "/pages/home/journey-iso-R1.webp",
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
    // Test: journey-cida-R1 | R2 | R3
    image: "/pages/home/journey-cida-R3.webp",
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
    // Test: journey-automotive-R1 | R2 | R3
    image: "/pages/home/journey-automotive-R2.webp",
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
    // Test: journey-kengen-R1 | R2 | R3
    image: "/pages/home/journey-kengen-R1.JPG.jpeg",
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
    // Test: journey-expansion-R1 | R2 | R3
    image: "/pages/home/journey-expansion-R1.webp",
    alt: "Engineers beside upgraded production machinery in a larger factory",
    objectPosition: "38% 45%",
    body: "Thimark expanded its factory to 29,500 sq. ft. and upgraded its machinery with advanced systems, strengthening its capacity for precision manufacturing and future growth.",
    longBody:
      "Thimark expanded its factory to 29,500 sq. ft. and upgraded its machinery with advanced systems, strengthening its capacity for precision manufacturing and future growth.",
  },
  {
    id: "finishing",
    year: "2026",
    label: "Surface Finishing",
    title: "Expanding Manufacturing Capability",
    icon: "precision",
    // Test: journey-finishing-R1 | R2 | R3
    image: "/pages/home/journey-finishing-R2.webp",
    alt: "Engineer inspecting a machined metal component with a digital caliper",
    objectPosition: "62% 35%",
    body: "Thimark planned to introduce a powder-coating facility at the Ekala IDB Industrial Zone, extending its manufacturing and finishing capabilities.",
    longBody:
      "Thimark planned to introduce a powder-coating facility at the Ekala IDB Industrial Zone, extending its manufacturing and finishing capabilities.",
  },
];

/** @deprecated Prefer JOURNEY — kept for call sites that still import STORY milestones. */
export type StoryItem = JourneyItem;
/** @deprecated Prefer JOURNEY */
export const STORY_MILESTONES = JOURNEY;

/* ---- Two Core / Three Disciplines ---------------------------------- */

export const TWO_CORE = {
  eyebrow: "What We Do",
  heading: ["Three Disciplines.", "One Shared Mindset."],
  lede: "From components to complete machinery, we combine engineering and manufacturing for practical automotive and industrial solutions.",
  columns: [
    {
      id: "automotive",
      index: "01",
      title: "Automotive Components",
      href: "/automotive",
      cta: "View Automotive Components",
      // Test: two-core-automotive-R1 | R2 | R3
      image: "/pages/home/two-core-automotive-R1.webp",
      alt: "Engineers assembling a motorcycle frame on the production line",
      objectPosition: "50% 45%",
      body: "We design, fabricate and supply motorcycle components for local assembly lines, supporting established manufacturers with consistent production and dependable quality. Over 30% local value addition.",
      areas: [
        { index: "01", label: "Component Range", href: "/automotive#product-range" },
        { index: "02", label: "OEM Partnerships", href: "/automotive#oem-partnerships" },
        { index: "03", label: "Local Value Addition", href: "/automotive#local-value-addition" },
      ],
    },
    {
      id: "engineering",
      index: "02",
      title: "Engineering & Services",
      href: "/engineering-services",
      cta: "View Engineering Services",
      // Test: two-core-engineering-R1 | R2 | R3
      image: "/pages/home/two-core-engineering-R1.webp",
      alt: "Welders fabricating heavy steel frames in the Thimark workshop",
      objectPosition: "50% 42%",
      body: "We take requirements from concept to finished part through new product development, reverse engineering and precision engineering.",
      areas: [
        {
          index: "01",
          label: "New Product Development",
          href: "/engineering-services#new-product-development",
        },
        {
          index: "02",
          label: "Reverse Engineering",
          href: "/engineering-services#reverse-engineering",
        },
        {
          index: "03",
          label: "Surface Finishing",
          href: "/engineering-services#surface-finishing",
        },
      ],
    },
    {
      id: "machinery",
      index: "03",
      title: "Industrial Machinery",
      href: "/industrial-machinery",
      cta: "View Industrial Machinery",
      // Test: two-core-machinery-R1 | R2 | R3
      image: "/pages/home/two-core-machinery-R1.JPG.jpeg",
      alt: "Engineers inspecting a custom industrial water-treatment machine",
      objectPosition: "50% 50%",
      body: "We design and manufacture custom machinery and fabricated systems for hydropower, water management, construction and other demanding industrial environments.",
      areas: [
        {
          index: "01",
          label: "Custom Machinery",
          href: "/industrial-machinery#portfolio",
        },
        {
          index: "02",
          label: "International Projects",
          href: "/industrial-machinery#kilgarrah",
        },
      ],
    },
  ],
} as const;

/* ---- Featured / Solutions ------------------------------------------ */

export const FEATURED = {
  eyebrow: "Engineered for the Real World",
  heading: ["Complex Challenges Need", "Smarter Engineering."],
  lede: "Solutions built around the application and the challenge \u2014 practical engineering with precision manufacturing and automation.",
} as const;

export const SOLUTIONS = [
  {
    id: "kilgharrah",
    name: "Kilgharrah 600",
    title: "Automated Trash Rack Cleaning Machine",
    callout: ["KenGen", "Hydropower Infrastructure"],
    // Test: solutions-kilgharrah-R1 | R2 | R3
    image: "/pages/home/solutions-kilgharrah-R1.JPG.jpeg",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
    objectPosition: "50% 45%",
    href: "/industrial-machinery#kilgarrah",
    cta: "View the Kilgharrah 600",
    imageSide: "right" as const,
    body: "Thimark designed and manufactured the Kilgharrah 600 for KenGen, delivering a custom-engineered hydraulic trash-rack cleaning solution for hydropower infrastructure.",
  },
  {
    id: "oem",
    name: "OEM Motorcycle Components",
    title: "Precision for Local Assembly",
    callout: ["DPMC / Bajaj", "Senaro", "Ranomoto"],
    // Test: solutions-oem-R1 | R2 | R3
    image: "/pages/home/solutions-oem-R4.webp",
    alt: "Precision motorcycle components on a workshop bench",
    objectPosition: "50% 50%",
    href: "/automotive#product-range",
    cta: "View the Component Range",
    imageSide: "left" as const,
    body: "Thimark manufactures key motorcycle components for local assembly programmes, supporting established OEM partners with precision-engineered parts and dependable production.",
  },
  {
    id: "machinery-work",
    name: "Custom Industrial Machinery",
    title: "Built Around Your Application",
    callout: ["Custom Engineering", "Site-Specific Solutions"],
    // Test: solutions-machinery-R1 | R2 | R3
    image: "/pages/home/solutions-machinery-R2.JPG.jpeg",
    alt: "Engineers assembling custom industrial machinery",
    objectPosition: "50% 50%",
    href: "/industrial-machinery#portfolio",
    cta: "View Custom Machinery",
    imageSide: "right" as const,
    body: "From specialized equipment to fabricated industrial systems, Thimark develops machinery around real operational requirements, helping customers address complex engineering challenges.",
  },
] as const;

/* ---- Capabilities -------------------------------------------------- */

export const CAPABILITIES_COPY: CapabilitiesSectionCopy = {
  eyebrow: "The Thimark Advantage",
  heading: ["Capability You", "Can Build On."],
  lede: [
    "Good ideas need the capability to become reliable products.",
    "Thimark brings manufacturing infrastructure, expertise and controlled processes to deliver with precision and consistency.",
  ],
};

export const CAPABILITIES_CTA = {
  label: "See Our Quality",
  href: "/#quality",
} satisfies Link;

export const CAPABILITIES = {
  items: HOME_CAPABILITIES,
  copy: CAPABILITIES_COPY,
  cta: CAPABILITIES_CTA,
  progressLabel: "Capabilities",
} as const;

/* ---- Quality ------------------------------------------------------- */

export const QUALITY = {
  eyebrow: "Quality by Design",
  heading: ["Precision Is a Process,", "Not a Promise."],
  paragraphs: [
    "At Thimark, quality is built into how we engineer and manufacture.",
    "ISO 9001:2015 and CIDA EM2 Grade reflect our commitment to controlled production and consistent results.",
    "Our approach covers material verification, in-process controls, testing and final inspection — with continuous improvement.",
  ],
  principleLead: "Our approach is guided by a simple principle:",
  principles: [
    "Reduce waste.",
    "Improve processes.",
    "Create consistent value.",
  ] as const,
  pillars: [
    {
      id: "quality",
      title: "Quality",
      // Test: quality-quality-R1 | R2 | R3
      image: "/pages/home/quality-quality-R1.webp",
      alt: "Engineer inspecting a machined metal component with a digital caliper",
      objectPosition: "62% 35%",
      body: "Controlled processes and attention to detail throughout manufacturing.",
    },
    {
      id: "lean",
      title: "Lean Thinking",
      // Test: quality-lean-R1 | R2 | R3
      image: "/pages/home/quality-lean-R3.webp",
      alt: "Operators working a lean production line with organized workstations",
      objectPosition: "38% 42%",
      body: "Improving efficiency, productivity and resource utilization while reducing unnecessary waste.",
    },
    {
      id: "improvement",
      title: "Continuous Improvement",
      // Test: quality-improvement-R1 | R2 | R3
      image: "/pages/home/quality-improvement-R2.webp",
      alt: "Engineers reviewing a manufactured housing against production drawings",
      objectPosition: "48% 38%",
      body: "Learning, refining processes and adopting technologies that strengthen performance.",
    },
  ],
  creds: [
    {
      id: "iso",
      org: "ISO",
      code: "9001:2015",
      sub: "Certified Quality Management System",
    },
    {
      id: "cida",
      org: "CIDA",
      code: "EM2",
      sub: "Heavy Steel Fabrication Grade",
    },
  ],
  cta: { label: "Our Approach to Quality", href: "/about#quality" } satisfies Link,
} as const;

/* ---- Partners ------------------------------------------------------ */

export const PARTNERS_COPY: PartnersSectionCopy = {
  eyebrow: "Trusted by Industry",
  heading: ["Engineering That", "Earns Trust."],
  lede: {
    strong: "Strong engineering partnerships are built over time.",
    rest: "We work with organizations that rely on our manufacturing capability, expertise and commitment to quality.",
  },
  statement:
    "From local manufacturing partnerships to international engineering projects, our work speaks through the relationships we build.",
};

export const PARTNERS_SECTION = {
  copy: PARTNERS_COPY,
  items: PARTNERS,
} as const;
