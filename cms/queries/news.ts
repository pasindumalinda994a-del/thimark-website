import type { News } from "@/payload-types";
import type { NewsRecord } from "@/app/(frontend)/newsroom/records";
import { isoDay, mediaAlt, mediaUrl, payloadClient } from "./payload";

function toRecord(doc: News): NewsRecord {
  const cover = mediaUrl(doc.heroImage);
  const photos = (doc.images ?? []).map((image) => mediaUrl(image)).filter(Boolean);
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
    images: cover ? [cover, ...photos] : photos,
    alt: mediaAlt(doc.heroImage) || doc.title || "",
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

export async function getNewsRecord(slug: string, { draft = false } = {}): Promise<NewsRecord | null> {
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
