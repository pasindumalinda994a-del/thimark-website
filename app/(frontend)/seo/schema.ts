import { COMPANY, SOCIAL_LINKS } from "@/app/(frontend)/components/site";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/app/(frontend)/seo/metadata";

type Node = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const ORG_REF = { "@id": ORG_ID };

const AREA_SERVED = [
  { "@type": "Country", name: "Sri Lanka" },
  { "@type": "Country", name: "Kenya" },
];

export const KNOWS_ABOUT = [
  "Automotive component manufacturing",
  "OEM motorcycle parts manufacturing",
  "Motorcycle brackets and stands",
  "Custom industrial machinery",
  "Hydropower equipment",
  "Hydraulic trash rack cleaning machines",
  "Special-purpose machinery",
  "Pneumatic conveying systems",
  "Dust collection systems",
  "Heavy steel fabrication",
  "Metal fabrication",
  "Product development engineering",
  "Reverse engineering and 3D scanning",
  "Powder coating",
];

export function graph(...nodes: Node[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organizationNode(): Node {
  const sameAs = SOCIAL_LINKS.map((link) => link.href).filter((href) => /^https?:\/\//.test(href));
  return {
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: COMPANY.name,
    url: SITE_URL,
    description: COMPANY.description,
    slogan: COMPANY.statement,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/logo-square.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/home-images/about-workshop.png"),
    telephone: "+94112051944",
    email: COMPANY.email.label,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 379/D, Maharanugegoda",
      addressLocality: "Kadawatha",
      addressRegion: "Western Province",
      postalCode: "11850",
      addressCountry: "LK",
    },
    hasMap: COMPANY.mapHref,
    foundingDate: "2014",
    foundingLocation: { "@type": "Place", name: "Sri Lanka" },
    areaServed: AREA_SERVED,
    knowsAbout: KNOWS_ABOUT,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "ISO 9001:2015 Quality Management System",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "registration",
        name: "CIDA EM2 Grade, Heavy Steel Fabrication",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+94112051944",
      email: COMPANY.email.label,
      areaServed: ["LK", "KE"],
      availableLanguage: ["en", "si"],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: COMPANY.name,
    inLanguage: "en",
    publisher: ORG_REF,
  };
}

export function siteSchema(): Node {
  return graph(organizationNode(), websiteNode());
}

export type Crumb = { name: string; path: string };

export function breadcrumbNode(crumbs: Crumb[]): Node {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

type WebPageInput = {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
};

export function webPageNode({ type = "WebPage", name, description, path }: WebPageInput): Node {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: ORG_REF,
  };
}

export type CatalogGroup = { name: string; items: readonly string[] };

type ServiceInput = {
  name: string;
  serviceType: string;
  description: string;
  path: string;
  catalog?: { name: string; groups: readonly CatalogGroup[] };
};

export function serviceNode({ name, serviceType, description, path, catalog }: ServiceInput): Node {
  return {
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: ORG_REF,
    areaServed: AREA_SERVED,
    ...(catalog
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: catalog.name,
            itemListElement: catalog.groups.map((group) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: group.name,
                description: group.items.join(", "),
              },
            })),
          },
        }
      : {}),
  };
}

type ArticleInput = {
  path: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  section?: string;
};

export function newsArticleNode({
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  section,
}: ArticleInput): Node {
  return {
    "@type": "NewsArticle",
    "@id": `${absoluteUrl(path)}#article`,
    mainEntityOfPage: absoluteUrl(path),
    headline,
    description,
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    articleSection: section,
    inLanguage: "en",
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL },
    publisher: ORG_REF,
  };
}
