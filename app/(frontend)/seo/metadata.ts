import type { Metadata } from "next";

/** Canonical production origin. Preview deployments still point canonicals and OG URLs here. */
export const SITE_URL = "https://thimark.com";
export const SITE_NAME = "Thimark";
export const SITE_LOCALE = "en_LK";
export const TITLE_TEMPLATE = "%s | Thimark";
export const DEFAULT_DESCRIPTION =
  "ISO 9001:2015 certified engineering company in Sri Lanka manufacturing OEM automotive components, custom industrial machinery and heavy steel fabrication.";

/** Only the production deployment may be indexed; Vercel previews and branch builds are not. */
export const INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

export const OG_KEYS = [
  "default",
  "automotive",
  "industrial-machinery",
  "engineering-services",
  "about",
] as const;
export type OgKey = (typeof OG_KEYS)[number];

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogImagePath(key: OgKey = "default") {
  return `/og/${key}`;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageImage = { url: string; alt: string; width?: number; height?: number };

type PageMetadataInput = {
  /** Page title; the root layout appends " | Thimark" unless `absoluteTitle` is set. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  keywords?: string[];
  og?: OgKey;
  image?: PageImage;
  noindex?: boolean;
  article?: { publishedTime: string; modifiedTime?: string; section?: string };
};

/**
 * Builds canonical, Open Graph and Twitter metadata for a page. Next merges `openGraph`
 * shallowly, so each page passes the whole object rather than relying on the layout's.
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  keywords,
  og = "default",
  image,
  noindex,
  article,
}: PageMetadataInput): Metadata {
  const images = [image ?? { url: ogImagePath(og), alt: title, ...OG_SIZE }];
  const shared = { siteName: SITE_NAME, locale: SITE_LOCALE, url: path, images };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: article
      ? {
          ...shared,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          section: article.section,
          authors: [SITE_URL],
        }
      : { ...shared, type: "website" },
    twitter: { card: "summary_large_image" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
