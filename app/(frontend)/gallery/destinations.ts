export const GALLERY_PAGES = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "automotive", label: "Automotive", href: "/automotive" },
  {
    id: "industrial-machinery",
    label: "Industrial machinery",
    href: "/industrial-machinery",
  },
  {
    id: "engineering-services",
    label: "Engineering services",
    href: "/engineering-services",
  },
  { id: "enquire", label: "Enquire", href: "/enquire" },
] as const;

export type GalleryPageId = (typeof GALLERY_PAGES)[number]["id"];

export type GalleryDestination = "page" | "news" | "none";

export const GALLERY_PAGE_OPTIONS = GALLERY_PAGES.map((page) => ({
  label: page.label,
  value: page.id,
}));

export function pageHref(id: string | null | undefined) {
  return GALLERY_PAGES.find((page) => page.id === id)?.href ?? null;
}

export function pageLabel(id: string | null | undefined) {
  return GALLERY_PAGES.find((page) => page.id === id)?.label ?? null;
}
