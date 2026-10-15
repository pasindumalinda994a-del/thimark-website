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
  /** Smaller rendition for listing cards and thumbnails. */
  card: string;
  images: string[];
  alt: string;
  updatedAt?: string;
  seo?: { title?: string; description?: string; image?: string };
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

export function categoryById(id: NewsCategoryId) {
  return NEWS_CATEGORIES.find((category) => category.id === id) ?? NEWS_CATEGORIES[0];
}

export function formatRecordDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function byNewest(a: NewsRecord, b: NewsRecord) {
  return b.date.localeCompare(a.date);
}

export function recordsIn(records: NewsRecord[], category: NewsCategoryId) {
  return records.filter((record) => record.category === category).sort(byNewest);
}

export function recordSrc(path: string) {
  if (/^https?:\/\//.test(path) || /%[0-9a-f]{2}/i.test(path)) return path;
  return encodeURI(path).replaceAll("&", "%26");
}
