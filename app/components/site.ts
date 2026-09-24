import { NAV_ITEMS, collectNavLinks, type NavLink } from "@/app/components/nav";

export const COMPANY = {
  name: "Thimark Technocreations (Pvt) Ltd",
  shortName: "Thimark",
  statement: "Engineering what moves industry forward.",
  description:
    "From precision automotive components to purpose-built industrial machinery, Thimark turns engineering challenges into dependable solutions — designed, manufactured, and built in Sri Lanka.",
  addressLines: ["No. 379/D, Maharanugegoda,", "Kadawatha, Sri Lanka"],
  locality: "Kadawatha, Sri Lanka",
  /** Approximate coordinates for Kadawatha, used as a technical stamp only. */
  coordinates: "07°00'N 79°57'E",
  timeZone: "Asia/Colombo",
  phone: { label: "+94 112 051 944", href: "tel:+94112051944" },
  email: { label: "info@thimark.com", href: "mailto:info@thimark.com" },
} as const;

export type ExternalLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  tag?: string;
};

/** Placeholder hrefs until the live profiles are supplied. */
export const SOCIAL_LINKS: ExternalLink[] = [
  { id: "linkedin", label: "LinkedIn", href: "#", external: true },
  { id: "facebook", label: "Facebook", href: "#", external: true },
  { id: "instagram", label: "Instagram", href: "#", external: true },
];

export const RESOURCE_LINKS: ExternalLink[] = [
  { id: "profile", label: "Company Profile", href: "/resources", tag: "PDF" },
  {
    id: "capability",
    label: "Capability Statement",
    href: "/resources",
    tag: "PDF",
  },
  { id: "iso", label: "ISO 9001 Certificate", href: "/resources", tag: "PDF" },
  {
    id: "catalogue",
    label: "Product Catalogue",
    href: "/resources",
    tag: "PDF",
  },
];

export const LEGAL_LINKS: ExternalLink[] = [
  { id: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { id: "terms", label: "Terms & Conditions", href: "/terms" },
];

export const FOOTER_NAV: NavLink[] = [
  { id: "home", label: "Home", href: "/" },
  ...collectNavLinks(NAV_ITEMS).map((link) => ({
    ...link,
    label: link.fullLabel ?? link.label,
  })),
];
