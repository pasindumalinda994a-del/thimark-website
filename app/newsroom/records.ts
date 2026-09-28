export type NewsCategoryId = "company" | "projects" | "awards" | "export" | "insights";

export type NewsCategory = {
  id: NewsCategoryId;
  label: string;
  full: string;
};

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "company", label: "Company", full: "Company news" },
  { id: "projects", label: "Projects", full: "Projects" },
  { id: "awards", label: "Awards", full: "Awards" },
  { id: "export", label: "Export", full: "Export projects" },
  { id: "insights", label: "Insights", full: "Insights" },
];

export type NewsSection = {
  heading: string;
  text: string;
  href?: string;
  hrefLabel?: string;
};

export type NewsRecord = {
  slug: string;
  category: NewsCategoryId;
  date: string;
  title: string;
  excerpt: string;
  body: NewsSection[];
  image: string;
  images: string[];
  alt: string;
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

const awardPhotos = [1, 2, 3, 4].map(
  (n) => `/news/awards-${String(n).padStart(2, "0")}.jpg`,
);
const launchPhotos = Array.from(
  { length: 17 },
  (_, i) => `/news/launch-${String(i + 1).padStart(2, "0")}.jpg`,
);

export const NEWS_RECORDS: NewsRecord[] = [
  {
    slug: "two-awards-kilgharrah-600",
    category: "awards",
    date: "2025-11-14",
    title: "Honored with two awards for Kilgharrah 600",
    excerpt:
      "Two awards for the Kenya project Kilgharrah 600, for engineering innovation and industrial research.",
    body: [
      {
        heading: "The awards",
        text: "These two awards were presented last Wednesday for the Kenya project, Kilgharrah 600, recognizing the team’s commitment to innovation, engineering excellence, and impactful industrial research.",
      },
      {
        heading: "Excellence in Engineering Innovation",
        text: "Award for Excellence in Engineering Innovation.",
      },
      {
        heading: "Outstanding Industrial Research",
        text: "Merit Award for Outstanding Industrial Research.",
      },
      {
        heading: "The team",
        text: "A big thank-you to everyone who contributed to making this project a success. Onward to even greater milestones.",
      },
    ],
    image: awardPhotos[0],
    images: awardPhotos,
    alt: "Thimark receiving awards for the Kilgharrah 600 Kenya project",
  },
  {
    slug: "product-launch-kilgharrah-600",
    category: "projects",
    date: "2025-10-31",
    title: "Product launch — Kilgharrah 600",
    excerpt:
      "The Kilgharrah 600 product launch, with the event video and photographs.",
    body: [
      {
        heading: "The launch",
        text: "Product launch for Kilgharrah 600.",
      },
      {
        heading: "Event video",
        text: "The launch event is on record.",
        href: "https://drive.google.com/file/d/1joGCLjZyCgivZhEPsG_cVD23dzu1b2RH/view",
        hrefLabel: "Event video",
      },
    ],
    image: launchPhotos[0],
    images: launchPhotos,
    alt: "Kilgharrah 600 at the product launch",
  },
];

export function categoryById(id: NewsCategoryId) {
  return NEWS_CATEGORIES.find((category) => category.id === id)!;
}

export function formatRecordDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function recordsIn(category: NewsCategoryId) {
  return NEWS_RECORDS.filter((record) => record.category === category).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export function getRecord(slug: string) {
  return NEWS_RECORDS.find((record) => record.slug === slug);
}

export function relatedRecords(slug: string, count = 4) {
  const current = getRecord(slug);
  if (!current || count < 1) return [];
  const rest = NEWS_RECORDS.filter((record) => record.slug !== slug);
  const byDate = (a: NewsRecord, b: NewsRecord) => b.date.localeCompare(a.date);
  const same = rest
    .filter((record) => record.category === current.category)
    .sort(byDate);
  const other = rest
    .filter((record) => record.category !== current.category)
    .sort(byDate);
  return [...same, ...other].slice(0, count);
}
