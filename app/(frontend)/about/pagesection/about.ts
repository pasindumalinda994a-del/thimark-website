import type { IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import type { StoryCopy } from "@/app/(frontend)/homesections/AboutSection";
import { STORY, type StoryItem } from "@/app/(frontend)/homesections/StoryProgress";

/* ---- Hero ---------------------------------------------------------- */

export const HERO = {
  eyebrow: "About Thimark",
  heading: ["Built on Engineering.", "Driven by Possibility."],
  intro:
    "From a small steel fabrication workshop to a growing force in Sri Lankan engineering and manufacturing, Thimark has built its journey around one belief: good engineering should create real, measurable value.",
  flanks: [
    { id: "origin", label: "Since 2014", sub: "Kadawatha, Sri Lanka" },
    { id: "standard", label: "ISO 9001:2015", sub: "Certified Quality Management" },
  ],
  image: {
    src: "/home-images/hero-bg.png",
    alt: "Thimark machinists and fabricators at work across the factory floor",
    objectPosition: "50% 58%",
  },
} as const;

/* ---- 01 Overview --------------------------------------------------- */

export const OVERVIEW = {
  index: "01",
  eyebrow: "Overview",
  heading: ["From Steel Fabrication", "to Advanced Engineering."],
  lede: "Thimark Technocreations (Pvt) Ltd is a proudly Sri Lankan engineering and manufacturing company with a strong reputation for quality, reliability and innovation.",
  mediaLabel: "Engineering in Practice",
  media: {
    src: "/home-images/two-core-machinery.png",
    alt: "Thimark engineers assembling and testing a heavy industrial machine",
    objectPosition: "50% 40%",
  },
  storyLabel: "Our Story",
  paragraphs: [
    "What began as a modest steel fabrication business has grown into an ISO 9001:2015 certified organization with capabilities spanning automotive component manufacturing, mechanical engineering, industrial machinery and custom-engineered solutions.",
    "Today, Thimark designs and manufactures specialized equipment for sectors including water supply, hydropower, construction and industrial manufacturing, while also producing high-quality OEM components for local motorcycle assembly programs.",
    "Our capabilities extend beyond Sri Lanka. Through projects such as the Kilgharrah 600 automated trash-cleaning machine developed for Kenya Electricity Generating Company (KenGen), Thimark has demonstrated its ability to take Sri Lankan engineering expertise to international applications.",
    "Today, we continue to invest in technology, manufacturing capability, research and innovation to build solutions for the evolving needs of industry.",
  ],
  /** Paragraph that carries the international marker. */
  highlight: 2,
  statement: ["From Fabrication to Innovation.", "From Local Capability to Global Possibility."],
  aside: [
    "Our story is not simply about how much we have grown.",
    "It is about what we have learned, what we have built, and where engineering can take us next.",
  ],
  snapshotLabel: "Company Snapshot",
  iso: { org: "ISO", code: "9001:2015", sub: "Certified Quality Management" },
} as const;

/* ---- 02 Vision & Mission ------------------------------------------- */

export const VISION_MISSION = {
  index: "02",
  eyebrow: "Where We Are Going",
  heading: ["Engineering a More Capable", "Future for Sri Lanka."],
  legend: ["Our Vision", "Our Mission", "Our Principles"],
  vision: {
    word: "Vision",
    paragraphs: [
      "Engineering Sri Lanka\u2019s future of mobility and innovation from quality components to world-class vehicles and machinery.",
    ],
  },
  mission: {
    word: "Mission",
    paragraphs: [
      "To advance Sri Lanka\u2019s industrial and automotive capability through precision engineering, innovation, and professionalism.",
      "We specialize in designing and manufacturing high-quality two-wheeler components that support and strengthen our local motorcycle manufacturers, while also developing commercial vehicles and machinery that serve the needs of Sri Lanka\u2019s industries and infrastructure.",
      "Guided by integrity, technology, and a strong commitment to ethical business practices, we strive to enhance local value addition, empower Sri Lankan engineering talent, and build dependable, purpose-driven vehicles and machinery proudly made in Sri Lanka.",
    ],
  },
} as const;

export const PRINCIPLES: readonly {
  id: string;
  title: string;
  body: string;
  icon: IsoIcon;
}[] = [
  {
    id: "precision",
    title: "Precision",
    body: "We engineer with attention to detail and consistency.",
    icon: "precision",
  },
  {
    id: "innovation",
    title: "Innovation",
    body: "We continuously explore better technologies and better ways of solving problems.",
    icon: "schema",
  },
  {
    id: "integrity",
    title: "Integrity",
    body: "We build relationships through professionalism, accountability and trust.",
    icon: "verified",
  },
  {
    id: "local-value",
    title: "Local Value",
    body: "We strengthen Sri Lanka\u2019s industrial ecosystem through manufacturing, skills and knowledge.",
    icon: "factory",
  },
];

/* ---- 03 Journey ---------------------------------------------------- */

export const JOURNEY_COPY: StoryCopy = {
  index: "03",
  eyebrow: "Our Journey",
  heading: ["Every Milestone", "Built the Next."],
  lede: "From a backyard fabrication business to advanced manufacturing and international engineering projects, Thimark\u2019s growth has been shaped by continuous learning, investment and the trust of its customers.",
  readoutLabel: "The Journey Continues",
  readout: [
    { text: "The journey continues. ", strong: true },
    {
      text: "Every expansion, certification, partnership and engineering project has added another layer to Thimark\u2019s capabilities. And the next milestone is already being engineered.",
    },
  ],
  cta: { label: "Explore the Gallery", href: "/gallery" },
};

const JOURNEY_COPY_BY_ID: Record<string, Pick<StoryItem, "label" | "title" | "body">> = {
  foundation: {
    label: "Founded",
    title: "From the Ground Up",
    body: "Thimark\u2019s journey began as a backyard steel fabrication business, laying the foundation for the engineering capabilities that would follow.",
  },
  iso: {
    label: "ISO 9001",
    title: "A New Standard of Quality",
    body: "Thimark achieved ISO 9001:2015 certification, establishing a formal quality management framework and strengthening its commitment to consistent manufacturing standards.",
  },
  cida: {
    label: "CIDA EM2",
    title: "Heavy Fabrication Capability Recognized",
    body: "Thimark achieved CIDA EM2 Grade in Heavy Steel Fabrication, marking an important recognition of its professional and manufacturing capabilities.",
  },
  automotive: {
    label: "Automotive",
    title: "Entering Automotive Manufacturing",
    body: "Thimark expanded into automotive parts manufacturing, beginning a new chapter as an OEM manufacturing partner for local motorcycle assembly programs.",
  },
  kengen: {
    label: "KenGen",
    title: "Engineering Beyond Borders",
    body: "Thimark designed and manufactured the Kilgharrah 600 automated trash-cleaning machine for Kenya Electricity Generating Company (KenGen), marking a major international engineering achievement.",
  },
  expansion: {
    label: "Expansion",
    title: "Building for the Next Chapter",
    body: "Thimark expanded its factory to 15,000 sq. ft. and upgraded its machinery with state-of-the-art systems, strengthening its capacity for advanced manufacturing and future growth.",
  },
};

export const JOURNEY: StoryItem[] = STORY.map((item) => ({
  ...item,
  ...JOURNEY_COPY_BY_ID[item.id],
}));

/* ---- 04 Recognition ------------------------------------------------ */

export const RECOGNITION = {
  index: "04",
  eyebrow: "Recognition",
  heading: ["Recognized for What We Build", "\u2014 and How We Build It."],
  intro:
    "Our progress has been recognized through national industry awards and professional accreditations, reflecting Thimark\u2019s continued commitment to manufacturing excellence and engineering capability.",
  statement: ["Recognition is a milestone.", "Excellence is the standard."],
  aside: [
    "Awards acknowledge where we\u2019ve been.",
    "Our focus remains on delivering the quality, reliability and engineering capability our customers expect from us every day.",
  ],
} as const;

export type Award = {
  id: string;
  name: string;
  year: string;
  tier: "Gold" | "Bronze";
  title: string;
  sector: string;
  body: string;
  ring: string;
};

export const AWARDS: readonly Award[] = [
  {
    id: "niea",
    name: "National Industry Excellence Awards",
    year: "2023",
    tier: "Gold",
    title: "Gold Award",
    sector: "Metal-Based Components Manufacturing Sector",
    body: "Recognition for Thimark\u2019s performance and contribution within the metal-based components manufacturing sector.",
    ring: "National Industry Excellence Awards \u00b7 2023 \u00b7 ",
  },
  {
    id: "cnci",
    name: "CNCI Achiever Award",
    year: "2025",
    tier: "Bronze",
    title: "Bronze Award",
    sector: "National Level Manufacturing Sector \u2014 Small Category",
    body: "Recognition at national level for Thimark\u2019s manufacturing performance as a small-category enterprise.",
    ring: "CNCI Achiever Award \u00b7 National Level \u00b7 2025 \u00b7 ",
  },
];

export const CREDENTIALS = [
  { id: "iso", org: "ISO", code: "9001:2015", sub: "Quality Management System" },
  { id: "cida", org: "CIDA", code: "EM2", sub: "Heavy Steel Fabrication" },
] as const;

/* ---- 05 Leadership ------------------------------------------------- */

export const LEADERSHIP = {
  index: "05",
  eyebrow: "Leadership",
  heading: ["Led by Engineering.", "Built by People."],
  intro:
    "Thimark\u2019s growth has been driven by a combination of engineering knowledge, manufacturing experience, customer trust and the commitment of its people.",
  leader: {
    name: "Tharanga Marasinghe",
    initials: "TM",
    credential: "B.Sc (Eng)",
    role: "Chairman and Managing Director",
    /** Set to a /public path to replace the monogram placeholder. */
    portrait: "" as string,
    portraitAlt: "Portrait of Tharanga Marasinghe, Chairman and Managing Director of Thimark",
  },
  leaders: [
    {
      id: "tharanga",
      honorific: "Mr.",
      name: "Tharanga Marasinghe",
      initials: "TM",
      role: "Chairman and Managing Director",
      portrait: "" as string,
      portraitAlt: "Portrait of Tharanga Marasinghe, Chairman and Managing Director of Thimark",
    },
    {
      id: "achala",
      honorific: "Mrs.",
      name: "Achala Iroshini",
      initials: "AI",
      role: "Director",
      portrait: "" as string,
      portraitAlt: "Portrait of Achala Iroshini, Director of Thimark",
    },
    {
      id: "thushara",
      honorific: "Mr.",
      name: "Thushara Marasinghe",
      initials: "TH",
      role: "Factory Manager",
      portrait: "" as string,
      portraitAlt: "Portrait of Thushara Marasinghe, Factory Manager of Thimark",
    },
    {
      id: "kadeesha",
      honorific: "Mr.",
      name: "Kadeesha Rathnayake",
      initials: "KR",
      role: "Production Manager",
      portrait: "" as string,
      portraitAlt: "Portrait of Kadeesha Rathnayake, Production Manager of Thimark",
    },
  ],
  messageLabel: "Leadership Message",
  quote: "Our journey has always been about turning engineering challenges into meaningful solutions.",
  message: [
    "From humble beginnings as a small steel fabrication workshop, Thimark has grown into an ISO 9001:2015 certified engineering organization with capabilities across automotive component manufacturing and mechanical engineering.",
    "Our progress has been shaped by the trust of our customers, the dedication of our team and our commitment to continuously developing our capabilities.",
    "From supporting Sri Lanka\u2019s growing motorcycle assembly industry to delivering an automated trash-cleaning system for an international hydropower application, every project has strengthened our belief in what Sri Lankan engineering can achieve.",
    "As we move forward, our focus remains clear: to deliver innovative, high-quality engineering solutions that empower industries and communities.",
  ],
} as const;
