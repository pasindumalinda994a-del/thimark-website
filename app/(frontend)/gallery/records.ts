export type GalleryCategoryId =
  | "manufacturing"
  | "projects"
  | "recognition"
  | "people";

export type GalleryFit = "cover" | "contain";

export type GalleryFrame = {
  id: string;
  title: string;
  category: GalleryCategoryId;
  note: string;
  image: string;
  /** Smaller rendition loaded as a WebGL texture by the desktop strip. */
  texture: string;
  alt: string;
  fit: GalleryFit;
  place: string;
  /** Site path or news URL; null when the photo is unlinked. */
  href: string | null;
  /** Short label for aria / UI, e.g. "About" or "News". */
  destinationLabel: string | null;
};

export type GalleryCategory = {
  id: GalleryCategoryId;
  label: string;
  full: string;
};

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: "manufacturing", label: "Manufacturing", full: "Manufacturing" },
  { id: "projects", label: "Projects", full: "Projects" },
  { id: "recognition", label: "Recognition", full: "Recognition" },
  { id: "people", label: "People", full: "People & Events" },
];

export function categoryById(id: GalleryCategoryId) {
  return GALLERY_CATEGORIES.find((item) => item.id === id) ?? GALLERY_CATEGORIES[0];
}

export function frameSrc(path: string) {
  if (/^https?:\/\//.test(path) || /%[0-9a-f]{2}/i.test(path)) return path;
  return encodeURI(path).replaceAll("&", "%26");
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
