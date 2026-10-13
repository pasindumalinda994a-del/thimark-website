import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type { Capability } from "@/app/(frontend)/homesections/CapabilitiesSection";
import { STORY as HOME_STORY, type StoryItem } from "@/app/(frontend)/homesections/StoryProgress";

type Link = { label: string; href: string };
type Media = { src: string; alt: string; objectPosition: string };

/* ---- Hero ---------------------------------------------------------- */

export const HERO = {
  eyebrow: "About Thimark",
  heading: ["Engineering Excellence.", "Delivering Trust."],
  intro:
    "Thimark Technocreations (Pvt) Ltd is a Sri Lankan engineering and manufacturing company built on precision, innovation and quality. From automotive components to custom industrial machinery, we turn practical engineering into dependable solutions.",
  supporting: ["Proudly Sri Lankan.", "Driven by Engineering.", "Built on Trust."],
  cta: { label: "Discover Our Story", href: "#story" } satisfies Link,
  image: {
    src: "/home-images/hero-bg.png",
    alt: "Thimark machinists and fabricators at work across the factory floor",
    objectPosition: "50% 58%",
  } satisfies Media,
  caption: ["Fig. 01", "Thimark Technocreations (Pvt) Ltd"],
} as const;

/* ---- 01 Company Story ---------------------------------------------- */

export const STORY = {
  index: "01",
  eyebrow: "Built From The Ground Up",
  heading: ["From Steel Fabrication", "to Advanced Engineering."],
  lede: "What began as a backyard steel fabrication business in 2014 has grown into a trusted Sri Lankan engineering and manufacturing company serving the automotive and industrial sectors.",
  storyLabel: "Our Story",
  since: "Since 2014",
  paragraphs: [
    "Over the years, Thimark has expanded its capabilities and invested in technology, turning engineering concepts, technical drawings and physical samples into precision components and custom-built machinery.",
    "Today our work spans OEM motorcycle components, heavy steel fabrication, industrial machinery, engineering development and surface finishing, brought together to solve complex manufacturing challenges.",
  ],
  media: {
    src: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    objectPosition: "50% 42%",
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
    "Our journey is driven by a simple belief: when engineering expertise meets innovation, quality and determination, challenges become opportunities to build something better.",
  cta: { label: "Explore Our Capabilities", href: "/#manufacturing" } satisfies Link,
} as const;

/* ---- 01b Our Journey ----------------------------------------------- */

export type JourneyItem = StoryItem & { status?: "planned" };

export const JOURNEY_COPY = {
  eyebrow: "Our Journey",
  heading: ["Every Milestone", "Built the Next."],
  readoutLabel: "Milestone",
  plannedLabel: "Planned",
} as const;

const JOURNEY_COPY_BY_ID: Record<
  string,
  Pick<JourneyItem, "label" | "title" | "body"> & { status?: "planned" }
> = {
  foundation: {
    label: "Founded",
    title: "From the Ground Up",
    body: "Thimark began as a backyard steel fabrication business, built on hard work, practical engineering and a commitment to lasting capability.",
  },
  iso: {
    label: "ISO 9001",
    title: "A New Standard of Quality",
    body: "Relocating to a new factory and achieving ISO 9001:2015 strengthened our quality management and commitment to consistent manufacturing standards.",
  },
  cida: {
    label: "CIDA EM2",
    title: "Recognizing Fabrication Capability",
    body: "Achieving CIDA EM2 Grade in Heavy Steel Fabrication marked a significant milestone in the development of our professional engineering and manufacturing capabilities.",
  },
  automotive: {
    label: "Automotive",
    title: "Entering Component Manufacturing",
    body: "Thimark entered automotive parts manufacturing, opening a new chapter in precision-engineered motorcycle components and OEM manufacturing partnerships.",
  },
  kengen: {
    label: "KenGen",
    title: "Engineering Beyond Borders",
    body: "We designed and manufactured the Kilgharrah 600 automated trash rack cleaning machine for Kenya Electricity Generating Company (KenGen), an international infrastructure project.",
  },
  expansion: {
    label: "Expansion",
    title: "Building for the Future",
    body: "Our factory expanded to 15,000 sq. ft., with machinery upgrades and Lean Manufacturing Practices to strengthen production, efficiency and future growth.",
  },
  finishing: {
    label: "Surface Finishing",
    title: "Expanding Our Capabilities",
    body: "Thimark planned to introduce a powder-coating facility at the Ekala IDB Industrial Zone, extending its surface-finishing capabilities.",
    // Confirm the facility's operational status before removing.
    status: "planned",
  },
};

export const JOURNEY: JourneyItem[] = HOME_STORY.map((item) => ({
  ...item,
  ...JOURNEY_COPY_BY_ID[item.id],
}));

/* ---- 02 Vision, Mission & Principles ------------------------------- */

export const DRIVES = {
  index: "02",
  eyebrow: "What Drives Us",
  heading: ["Engineering a Stronger", "Industrial Future."],
  intro:
    "Engineering is about more than manufacturing. It is about developing local capability, solving practical challenges and creating lasting value through technology, skilled people and responsible practice.",
  bands: [
    {
      id: "vision",
      label: "Our Vision",
      callout: ["Mobility", "Innovation"],
      imageSide: "right",
      media: {
        src: "/home-images/two-core-automotive.png",
        alt: "Precision motorcycle components on a workshop bench",
        objectPosition: "50% 50%",
      },
      lead: "Engineering Sri Lanka\u2019s future of mobility and innovation \u2014 from quality components to world-class vehicles and machinery.",
      paragraphs: [] as string[],
    },
    {
      id: "mission",
      label: "Our Mission",
      callout: ["Industry", "Infrastructure"],
      imageSide: "left",
      media: {
        src: "/home-images/featured-kilgharrah.png",
        alt: "Kilgharrah 600 trash-rack cleaner built by Thimark operating at a hydropower intake",
        objectPosition: "50% 50%",
      },
      lead: "To advance Sri Lanka\u2019s industrial and automotive capability through precision engineering, innovation and professionalism.",
      paragraphs: [
        "We design and manufacture high-quality two-wheeler components for local motorcycle manufacturers, and develop commercial vehicles and machinery for Sri Lanka\u2019s industries and infrastructure.",
        "Guided by integrity, technology and ethical practice, we enhance local value addition, empower Sri Lankan engineering talent and build dependable vehicles and machinery made in Sri Lanka.",
      ],
    },
  ] as const,
  principlesLabel: "Our Principles",
} as const;

export const PRINCIPLES: readonly {
  id: string;
  title: string;
  body: string;
  icon: IsoIcon;
}[] = [
  {
    id: "quality",
    title: "Quality Without Compromise",
    body: "Precision, controlled processes and consistent standards, so customers can depend on what we deliver.",
    icon: "check",
  },
  {
    id: "innovation",
    title: "Innovation Through Engineering",
    body: "Technical knowledge, practical thinking and emerging technologies, applied to real-world problems.",
    icon: "cognition",
  },
  {
    id: "integrity",
    title: "Integrity in Every Relationship",
    body: "Lasting partnerships built through honesty, accountability, professionalism and ethical practice.",
    icon: "verified",
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    body: "We refine processes, reduce waste and strengthen our capabilities as requirements evolve.",
    icon: "trending",
  },
  {
    id: "local",
    title: "Local Capability, Global Ambition",
    body: "Strengthening Sri Lankan manufacturing, with solutions for demanding applications beyond our borders.",
    icon: "globe",
  },
];

/* ---- 03 Quality & Continuous Improvement --------------------------- */

export const QUALITY = {
  index: "03",
  eyebrow: "Quality by Design",
  heading: ["Better Processes. Better Products.", "Lasting Trust."],
  lede: "Quality is not simply the final inspection of a finished product. At Thimark, it influences how we plan, engineer, manufacture and improve our work.",
  headLabel: "Our Quality System",
  paragraphs: [
    "Our ISO 9001:2015 quality system supports consistent manufacturing, from material verification and production controls through testing and final inspection.",
    "But quality does not stop with meeting requirements. We continually look for ways to work smarter, improve efficiency and deliver greater value to our customers.",
  ],
  media: {
    src: "/home-images/quality-inspection.jpeg",
    alt: "Engineer inspecting a machined metal component with a digital caliper",
    objectPosition: "62% 35%",
  } satisfies Media,
  cred: { org: "ISO", code: "9001:2015", sub: "Certified Quality Management System" },
} as const;

export const HOW_WE_WORK = {
  eyebrow: "How We Work",
  heading: ["Six Practices.", "One Standard of Quality."],
  lede: [
    "Our philosophy is straightforward: reduce waste, improve processes and create consistent value \u2014 for our customers, our people and the industries we serve.",
  ],
  progressLabel: "Practices",
  closing: ["Reduce waste.", "Improve processes.", "Create consistent value."],
} as const;

export const PRACTICES: readonly Capability[] = [
  {
    id: "iso",
    tag: "ISO 9001:2015",
    title: "A Foundation for Quality",
    body: "A certified framework for consistent processes, customer-focused manufacturing and meeting specifications.",
    icon: "verified",
  },
  {
    id: "lean",
    tag: "Lean Manufacturing",
    title: "Creating More Value",
    body: "Lean principles that cut unnecessary activity, improve workflow and make better use of resources.",
    icon: "conveyor",
  },
  {
    id: "5s",
    tag: "5S",
    title: "Building Better Workplaces",
    body: "Organization, cleanliness and standardized practice for safer, more efficient workplaces.",
    icon: "stacks",
  },
  {
    id: "standard",
    tag: "Standardized Work",
    title: "Consistency in Every Process",
    body: "Clear methods and documented procedures for repeatable, dependable production.",
    icon: "schema",
  },
  {
    id: "kaizen",
    tag: "Kaizen",
    title: "Progress Through Small Improvements",
    body: "Continual small improvements in how we work, solve problems and develop our capabilities.",
    icon: "trending",
  },
  {
    id: "problem-solving",
    tag: "Problem-Solving",
    title: "Learning From Every Challenge",
    body: "Root Cause Analysis, 5 Whys, A3 and PDCA to find causes, guide action and keep improving.",
    icon: "troubleshoot",
  },
];

/* ---- 04 Awards & Recognitions -------------------------------------- */

export const RECOGNITION = {
  index: "04",
  eyebrow: "Milestones of Excellence",
  heading: ["Recognition Built on", "Engineering and Performance."],
  intro:
    "Every milestone in our journey reflects the dedication of our people and our commitment to strengthening Sri Lankan engineering and manufacturing.",
  band: {
    label: "Our Recognitions",
    callout: ["SLTC Research &", "Innovation Awards 2025"],
    body: "From business performance and industrial manufacturing to research and innovation, these recognitions push us to raise our standards.",
    media: {
      src: "/news/awards-01.jpg",
      alt: "Two SLTC Research & Innovation Awards 2025 trophies presented to Thimark Technocreations",
      objectPosition: "50% 45%",
    } satisfies Media,
  },
  closingLabel: "Closing Note",
  closing:
    "These milestones mark our development. Our focus remains on earning trust through the quality of our work, our engineering and the value we create.",
} as const;

export type Award = {
  id: string;
  year: string;
  name: string;
  org: string;
  seal: { label: string; solid: boolean };
  ring: string;
  distinctions: readonly string[];
};

export const AWARDS: readonly Award[] = [
  {
    id: "nbea",
    year: "2026",
    name: "National Business Excellence Awards",
    org: "NBEA",
    seal: { label: "Gold", solid: true },
    ring: "National Business Excellence Awards \u00b7 NBEA \u00b7 2026 \u00b7 ",
    distinctions: [
      "Gold Winner \u2014 Excellence in Business & Financial Results, Medium Category.",
      "Gold Winner \u2014 Manufacturing, Engineering Sector.",
    ],
  },
  {
    id: "sltc",
    year: "2025",
    name: "SLTC Research & Innovation Awards",
    org: "Sri Lanka Technology Campus",
    seal: { label: "Excellence", solid: true },
    ring: "SLTC Research & Innovation Awards \u00b7 2025 \u00b7 ",
    distinctions: [
      "Award for Excellence in Engineering Innovation.",
      "Merit Award for Outstanding Industrial Research.",
    ],
  },
  {
    id: "cnci",
    year: "2025",
    name: "CNCI Achiever Awards",
    org: "Ceylon National Chamber of Industries",
    seal: { label: "Bronze", solid: false },
    ring: "CNCI Achiever Awards \u00b7 National Level \u00b7 2025 \u00b7 ",
    distinctions: ["Bronze Award \u2014 National Level Manufacturing Sector, Small Category."],
  },
  {
    id: "niea",
    year: "2023",
    name: "National Industry Excellence Awards",
    org: "Industrial Development Board (IDB)",
    seal: { label: "Gold", solid: true },
    ring: "National Industry Excellence Awards \u00b7 IDB \u00b7 2023 \u00b7 ",
    distinctions: ["Gold Award \u2014 Metal-based Automobile Component Manufacturing Sector."],
  },
];

/* ---- 05 Leadership & People ---------------------------------------- */

export const LEADERSHIP = {
  index: "05",
  eyebrow: "The People Behind the Engineering",
  heading: ["Driven by People.", "Built Through Expertise."],
  intro:
    "Behind every component manufactured, every engineering challenge solved and every project delivered is a team committed to getting the details right.",
  body: "Leadership, engineering knowledge and hands-on experience turn customer requirements into practical solutions. We value professionalism, collaboration and continuous learning.",
  teamLabel: "Our Leadership Team",
  leaders: [
    {
      id: "tharanga",
      honorific: "Mr.",
      name: "Tharanga Marasinghe",
      credential: "B.Sc Eng",
      initials: "TM",
      role: "Chairman, Managing Director & Co-Founder",
      bio: "Providing engineering leadership and strategic direction, with a commitment to advancing Sri Lankan manufacturing and engineering capability.",
      /** Set to a /public path to replace the monogram placeholder. */
      portrait: "" as string,
      portraitAlt: "Portrait of Tharanga Marasinghe, Chairman, Managing Director and Co-Founder of Thimark",
    },
    {
      id: "achala",
      honorific: "Mrs.",
      name: "Achala Iroshini",
      credential: "",
      initials: "AI",
      role: "Director",
      bio: "Supporting the company\u2019s leadership and continued organizational development.",
      portrait: "" as string,
      portraitAlt: "Portrait of Achala Iroshini, Director of Thimark",
    },
    {
      id: "thushara",
      honorific: "Mr.",
      name: "Thushara Marasinghe",
      credential: "",
      initials: "TH",
      role: "Factory Manager",
      bio: "Overseeing factory operations and supporting efficient, coordinated manufacturing activities.",
      portrait: "" as string,
      portraitAlt: "Portrait of Thushara Marasinghe, Factory Manager of Thimark",
    },
    {
      id: "kadeesha",
      honorific: "Mr.",
      name: "Kadeesha Rathnayake",
      credential: "",
      initials: "KR",
      role: "Production Manager",
      bio: "Supporting production planning and execution to maintain manufacturing consistency and meet operational requirements.",
      portrait: "" as string,
      portraitAlt: "Portrait of Kadeesha Rathnayake, Production Manager of Thimark",
    },
  ],
} as const;

export const PEOPLE = {
  label: "Our People, Our Strength",
  paragraphs: [
    "Our engineers, production teams and skilled manufacturing personnel bring practical knowledge, technical expertise and dedication to every stage of our work.",
    "From design and fabrication to production, inspection and finishing, we build dependable products for real-world applications.",
  ],
  media: {
    src: "/Gallery Images/ThimarkWorkshop-tlkjrLBgY8PszAucZdS4Cg.jpg",
    alt: "Thimark team inspecting QC-passed components at a workshop bench",
    objectPosition: "50% 40%",
  } satisfies Media,
  closing:
    "At Thimark, engineering excellence is a collective effort \u2014 built by people who take pride in their work and believe in what Sri Lankan industry can achieve.",
} as const;
