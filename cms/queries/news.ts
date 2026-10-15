import { cache } from "react";
import type { Where } from "payload";
import type { News } from "@/payload-types";
import type { NewsRecord } from "@/app/(frontend)/newsroom/records";
import { isoDay, mediaAlt, mediaUrl, payloadClient } from "./payload";

function toRecord(doc: News): NewsRecord {
  const cover = mediaUrl(doc.heroImage, "hero");
  const photos = (doc.images ?? []).map((image) => mediaUrl(image, "hero")).filter(Boolean);
  return {
    slug: doc.slug,
    category: doc.category,
    date: isoDay(doc.date),
    title: doc.title ?? "",
    excerpt: doc.excerpt ?? "",
    body: (doc.body ?? []).map((section) => ({
      heading: section.heading,
      text: section.text,
      href: section.href || undefined,
      hrefLabel: section.hrefLabel || undefined,
    })),
    image: cover,
    card: mediaUrl(doc.heroImage, "card") || cover,
    images: cover ? [cover, ...photos] : photos,
    alt: mediaAlt(doc.heroImage) || doc.title || "",
    updatedAt: doc.updatedAt,
    seo: {
      title: doc.seo?.metaTitle || undefined,
      description: doc.seo?.metaDescription || undefined,
      image: mediaUrl(doc.seo?.ogImage, "og") || mediaUrl(doc.heroImage, "og") || undefined,
    },
  };
}

export async function getNewsRecords(): Promise<NewsRecord[]> {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "news",
    where: { _status: { equals: "published" } },
    sort: "-date",
    depth: 1,
    limit: 200,
    pagination: false,
  });
  return result.docs.map(toRecord).filter((record) => record.image);
}

/** Shared by generateMetadata and the page within one request; cache() keys on primitive args only. */
const findNewsRecord = cache(async (slug: string, draft: boolean): Promise<NewsRecord | null> => {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "news",
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? toRecord(doc) : null;
});

export function getNewsRecord(slug: string, { draft = false } = {}): Promise<NewsRecord | null> {
  return findNewsRecord(slug, draft);
}

/** Newest published stories from the same category first, topped up from the rest of the register. */
export async function getRelatedNews(current: NewsRecord, count = 4): Promise<NewsRecord[]> {
  if (count < 1) return [];
  const payload = await payloadClient();
  const find = (category: Where, limit: number) =>
    payload.find({
      collection: "news",
      where: {
        and: [
          { _status: { equals: "published" } },
          { slug: { not_equals: current.slug } },
          { heroImage: { exists: true } },
          category,
        ],
      },
      sort: "-date",
      depth: 1,
      limit,
      pagination: false,
    });

  const same = (await find({ category: { equals: current.category } }, count)).docs.map(toRecord);
  if (same.length >= count) return same;
  const other = await find({ category: { not_equals: current.category } }, count - same.length);
  return [...same, ...other.docs.map(toRecord)];
}

export async function getNewsSitemapEntries(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "news",
    where: { _status: { equals: "published" } },
    select: { slug: true, updatedAt: true },
    sort: "-date",
    depth: 0,
    limit: 1000,
    pagination: false,
  });
  return result.docs.map((doc) => ({ slug: doc.slug, updatedAt: doc.updatedAt }));
}

export async function getNewsSlugs(): Promise<string[]> {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "news",
    where: { _status: { equals: "published" } },
    select: { slug: true },
    depth: 0,
    limit: 500,
    pagination: false,
  });
  return result.docs.map((doc) => doc.slug);
}
