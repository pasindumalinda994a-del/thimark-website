import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/(frontend)/seo/metadata";
import { getNewsSitemapEntries } from "@/cms/queries/news";

export const revalidate = 3600;

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/industrial-machinery", changeFrequency: "monthly", priority: 0.9 },
  { path: "/automotive", changeFrequency: "monthly", priority: 0.9 },
  { path: "/engineering-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/enquire", changeFrequency: "yearly", priority: 0.7 },
  { path: "/newsroom", changeFrequency: "weekly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
];

async function newsEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await getNewsSitemapEntries();
    return entries.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(`/newsroom/${slug}`),
      lastModified: new Date(updatedAt),
      changeFrequency: "yearly",
      priority: 0.5,
    }));
  } catch (error) {
    console.error("sitemap: could not load newsroom stories", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
  return [...pages, ...(await newsEntries())];
}
