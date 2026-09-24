export type NavLink = {
  id: string;
  label: string;
  href: string;
  /** Long-form name used in the footer and as the link's accessible name. */
  fullLabel?: string;
};

export type NavItem = Omit<NavLink, "href"> & {
  href?: string;
  children?: NavLink[];
};

export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About Us", href: "/about" },
  {
    id: "capabilities",
    label: "Products / Services",
    children: [
      {
        id: "automotive",
        label: "Automotive",
        fullLabel: "Automotive Component Manufacturing",
        href: "/automotive",
      },
      {
        id: "machinery",
        label: "Industrial Machinery",
        fullLabel: "Design & Manufacture of Industrial Machinery Components",
        href: "/industrial-machinery",
      },
    ],
  },
  { id: "newsroom", label: "Newsroom", href: "/newsroom" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "contact", label: "Contact Us", href: "/contact" },
];

export const PATH_ACTIVE_IDS: Record<string, string> = {
  "/about": "about",
  "/automotive": "automotive",
  "/industrial-machinery": "machinery",
  "/newsroom": "newsroom",
  "/gallery": "gallery",
  "/contact": "contact",
};

export const RAQ_LINK = {
  id: "raq",
  label: "RAQ",
  href: "/#contact",
  ariaLabel: "Request a Quote",
} as const;

export type HomeSection = {
  /** DOM id of the homepage section (`<SectionGrid id=…>`). */
  id: string;
  /** Short readout label shown in the progress rail. */
  label: string;
  /** Sidebar nav item that should read as current while this section is in view. */
  navId: string | null;
};

export const HOME_SECTIONS: readonly HomeSection[] = [
  { id: "hero", label: "Overview", navId: null },
  { id: "about", label: "Our Story", navId: "about" },
  { id: "capabilities", label: "What We Do", navId: "capabilities" },
  { id: "products", label: "Solutions", navId: "capabilities" },
  { id: "manufacturing", label: "Advantage", navId: "capabilities" },
  { id: "quality", label: "Quality", navId: null },
  { id: "partners", label: "Partners", navId: null },
  { id: "catalogue", label: "Catalogue", navId: "capabilities" },
  { id: "contact", label: "Contact", navId: "contact" },
];

export function collectNavLinks(items: NavItem[]): NavLink[] {
  const links: NavLink[] = [];
  for (const item of items) {
    if (item.href) {
      links.push({ id: item.id, label: item.label, href: item.href });
    }
    if (item.children) {
      links.push(...item.children);
    }
  }
  return links;
}

const PATH_LABELS: Record<string, string> = {
  "/": "Home",
};

for (const link of collectNavLinks(NAV_ITEMS)) {
  PATH_LABELS[link.href] = link.label;
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export function pathLabel(pathname: string): string {
  const path = normalizePath(pathname);
  if (PATH_LABELS[path]) return PATH_LABELS[path];

  const slug = path.replace(/^\//, "").replace(/-/g, " ").trim();
  if (!slug) return "Home";
  return slug.replace(/\b\w/g, (char) => char.toUpperCase());
}
