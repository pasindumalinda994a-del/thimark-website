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
    label: "Automotive Components",
    children: [
      {
        id: "automotive-range",
        label: "Component Range",
        fullLabel: "Automotive Component Range",
        href: "/automotive#product-range",
      },
      {
        id: "automotive-oem",
        label: "OEM Partnerships",
        fullLabel: "Automotive OEM Partnerships",
        href: "/automotive#oem-partnerships",
      },
      {
        id: "automotive-manufacturing",
        label: "Manufacturing",
        fullLabel: "Automotive Components Manufacturing",
        href: "/automotive#process",
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Services",
    children: [
      {
        id: "engineering-npd",
        label: "New Product Development",
        fullLabel: "New Product Development",
        href: "/engineering-services#new-product-development",
      },
      {
        id: "engineering-reverse",
        label: "Reverse Engineering",
        fullLabel: "Reverse Engineering",
        href: "/engineering-services#reverse-engineering",
      },
      {
        id: "engineering-surface",
        label: "Surface Finishing",
        fullLabel: "Surface Finishing",
        href: "/engineering-services#surface-finishing",
      },
    ],
  },
  {
    id: "machinery",
    label: "Industrial Machinery",
    children: [
      {
        id: "machinery-custom",
        label: "Custom Machinery",
        fullLabel: "Custom Industrial Machinery",
        href: "/industrial-machinery#portfolio",
      },
      {
        id: "machinery-fabrication",
        label: "Heavy Fabrication",
        fullLabel: "Industrial Heavy Fabrication",
        href: "/industrial-machinery#capabilities",
      },
      {
        id: "machinery-exports",
        label: "International Projects",
        fullLabel: "Industrial Machinery International Projects",
        href: "/industrial-machinery#kilgarrah",
      },
    ],
  },
  { id: "newsroom", label: "Newsroom", href: "/newsroom" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
];

export const PATH_ACTIVE_IDS: Record<string, string> = {
  "/about": "about",
  "/automotive": "automotive",
  "/engineering-services": "engineering",
  "/industrial-machinery": "machinery",
  "/newsroom": "newsroom",
  "/gallery": "gallery",
};

export const RAQ_LINK = {
  id: "enquire",
  label: "Enquire",
  href: "/enquire",
  ariaLabel: "Enquire with Thimark",
} as const;

export type HomeSection = {
  /** DOM id of the section the rail tracks (`<SectionGrid id=…>`). */
  id: string;
  /** Short readout label shown in the progress rail. */
  label: string;
  /** Sidebar nav item that should read as current while this section is in view. */
  navId: string | null;
};

export const HOME_SECTIONS: readonly HomeSection[] = [
  { id: "hero", label: "Overview", navId: null },
  { id: "story", label: "Our Story", navId: "about" },
  { id: "about", label: "Journey", navId: "about" },
  { id: "capabilities", label: "What We Do", navId: "capabilities" },
  { id: "products", label: "Solutions", navId: "capabilities" },
  { id: "manufacturing", label: "Advantage", navId: "capabilities" },
  { id: "quality", label: "Quality", navId: null },
  { id: "partners", label: "Partners", navId: null },
  { id: "catalogue", label: "Catalogue", navId: "capabilities" },
  { id: "contact", label: "Contact", navId: null },
];

const ABOUT_SECTIONS: readonly HomeSection[] = [
  { id: "about-hero", label: "Overview", navId: null },
  { id: "story", label: "Our Story", navId: null },
  { id: "journey", label: "Journey", navId: null },
  { id: "vision-mission", label: "Vision", navId: null },
  { id: "quality", label: "Quality", navId: null },
  { id: "how-we-work", label: "Practices", navId: null },
  { id: "recognition", label: "Recognition", navId: null },
  { id: "leadership", label: "Leadership", navId: null },
  { id: "contact", label: "Contact", navId: null },
];

const AUTOMOTIVE_SECTIONS: readonly HomeSection[] = [
  { id: "hero", label: "Overview", navId: null },
  { id: "product-range", label: "Range", navId: "automotive-range" },
  { id: "oem-partnerships", label: "Partnerships", navId: "automotive-oem" },
  { id: "process", label: "Process", navId: "automotive-manufacturing" },
  { id: "manufacturing", label: "Capabilities", navId: "automotive-manufacturing" },
  { id: "contact", label: "Contact", navId: null },
];

const MACHINERY_SECTIONS: readonly HomeSection[] = [
  { id: "hero", label: "Overview", navId: null },
  { id: "portfolio", label: "Portfolio", navId: "machinery-custom" },
  { id: "process", label: "Approach", navId: null },
  { id: "kilgarrah", label: "Kilgarrah", navId: "machinery-exports" },
  { id: "capabilities", label: "Capabilities", navId: "machinery-fabrication" },
  { id: "contact", label: "Contact", navId: null },
];

const ENGINEERING_SECTIONS: readonly HomeSection[] = [
  { id: "hero", label: "Overview", navId: null },
  { id: "new-product-development", label: "Development", navId: "engineering-npd" },
  { id: "reverse-engineering", label: "Reverse", navId: "engineering-reverse" },
  { id: "surface-finishing", label: "Finishing", navId: "engineering-surface" },
  { id: "engineering-quality", label: "Quality", navId: null },
  { id: "capabilities", label: "Capabilities", navId: null },
  { id: "contact", label: "Contact", navId: null },
];

/** Routes that show the scrolling section index instead of the page readout. */
export const PAGE_SECTIONS: Record<string, readonly HomeSection[]> = {
  "/": HOME_SECTIONS,
  "/about": ABOUT_SECTIONS,
  "/automotive": AUTOMOTIVE_SECTIONS,
  "/industrial-machinery": MACHINERY_SECTIONS,
  "/engineering-services": ENGINEERING_SECTIONS,
};

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
  "/enquire": "Enquire",
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

/** Path portion of a nav href, without a section hash. */
export function hrefPath(href: string): string {
  const hash = href.indexOf("#");
  return hash === -1 ? href : href.slice(0, hash);
}

for (const item of NAV_ITEMS) {
  const base = item.children?.[0] ? hrefPath(item.children[0].href) : "";
  if (!base) continue;
  if (item.children?.every((child) => hrefPath(child.href) === base)) {
    PATH_LABELS[base] = item.label;
  }
}

/** In-page sections for a division route, in sidebar order. */
export function divisionSectionTargets(
  pathname: string,
): { id: string; navId: string }[] {
  const path = normalizePath(pathname);
  const group = NAV_ITEMS.find((item) =>
    item.children?.some((child) => hrefPath(child.href) === path),
  );
  if (!group?.children) return [];

  return group.children.flatMap((child) => {
    if (hrefPath(child.href) !== path) return [];
    const id = child.href.split("#")[1];
    if (!id) return [];
    return [{ id, navId: child.id }];
  });
}

/** Label of the nav group that owns `pathname`, or "Main" for top-level pages. */
export function pathSection(pathname: string): string {
  const path = normalizePath(pathname);
  const group = NAV_ITEMS.find(
    (item) =>
      item.href === path ||
      item.children?.some((child) => hrefPath(child.href) === path),
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
