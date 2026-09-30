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
    id: "automotive",
    label: "Automotive",
    children: [
      {
        id: "automotive-products",
        label: "Products",
        fullLabel: "Automotive Products",
        href: "/automotive/products",
      },
      {
        id: "automotive-services",
        label: "Services",
        fullLabel: "Automotive Services",
        href: "/automotive/services",
      },
      {
        id: "automotive-value",
        label: "Local Value Addition",
        fullLabel: "Automotive Local Value Addition",
        href: "/automotive/local-value-addition",
      },
    ],
  },
  {
    id: "machinery",
    label: "Industrial Machinery",
    children: [
      {
        id: "machinery-products",
        label: "Products",
        fullLabel: "Industrial Machinery Products",
        href: "/industrial-machinery/products",
      },
      {
        id: "machinery-services",
        label: "Services",
        fullLabel: "Industrial Machinery Services",
        href: "/industrial-machinery/services",
      },
      {
        id: "machinery-exports",
        label: "Exports",
        fullLabel: "Industrial Machinery Exports",
        href: "/industrial-machinery/exports",
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
  "/automotive/products": "automotive-products",
  "/automotive/services": "automotive-services",
  "/automotive/local-value-addition": "automotive-value",
  "/industrial-machinery": "machinery",
  "/industrial-machinery/products": "machinery-products",
  "/industrial-machinery/services": "machinery-services",
  "/industrial-machinery/exports": "machinery-exports",
  "/newsroom": "newsroom",
  "/gallery": "gallery",
  "/contact": "contact",
};

export const RAQ_LINK = {
  id: "raq",
  label: "RAQ",
  href: "/request-a-quote",
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
  "/request-a-quote": "Request a Quote",
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

/** Label of the nav group that owns `pathname`, or "Main" for top-level pages. */
export function pathSection(pathname: string): string {
  const path = normalizePath(pathname);
  const group = NAV_ITEMS.find((item) =>
    item.children?.some((child) => child.href === path),
  );
  return group?.label ?? "Main";
}

export function pathLabel(pathname: string): string {
  const path = normalizePath(pathname);
  if (PATH_LABELS[path]) return PATH_LABELS[path];

  const slug = path.replace(/^\//, "").replace(/-/g, " ").trim();
  if (!slug) return "Home";
  return slug.replace(/\b\w/g, (char) => char.toUpperCase());
}
