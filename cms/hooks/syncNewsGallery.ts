import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
} from "payload";
import type { GalleryCategoryId } from "@/app/(frontend)/gallery/records";
import type { NewsCategoryId } from "@/app/(frontend)/newsroom/records";

const NEWS_TO_GALLERY: Record<NewsCategoryId, GalleryCategoryId> = {
  awards: "recognition",
  projects: "projects",
  company: "people",
  export: "projects",
  insights: "people",
};

function mediaId(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id: unknown }).id;
    return typeof id === "string" || typeof id === "number" ? String(id) : null;
  }
  return null;
}

function galleryCategory(category: unknown): GalleryCategoryId {
  if (typeof category === "string" && category in NEWS_TO_GALLERY) {
    return NEWS_TO_GALLERY[category as NewsCategoryId];
  }
  return "projects";
}

function sourceKey(newsId: string, imageId: string) {
  return `${newsId}:${imageId}`;
}

type NewsLike = {
  id: string | number;
  title?: unknown;
  excerpt?: unknown;
  category?: unknown;
  heroImage?: unknown;
  images?: unknown;
  _status?: unknown;
};

/** Cover first, then Photos-tab images, de-duplicated. */
export function newsGalleryImageIds(doc: NewsLike): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const push = (value: unknown) => {
    const id = mediaId(value);
    if (!id || seen.has(id)) return;
    seen.add(id);
    ids.push(id);
  };
  push(doc.heroImage);
  if (Array.isArray(doc.images)) {
    for (const image of doc.images) push(image);
  }
  return ids;
}

async function findBySourceKey(payload: Payload, key: string) {
  const result = await payload.find({
    collection: "gallery",
    where: { sourceKey: { equals: key } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs[0] ?? null;
}

async function findAllLinked(payload: Payload, newsId: string) {
  const result = await payload.find({
    collection: "gallery",
    where: { sourceNews: { equals: newsId } },
    limit: 300,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  return result.docs;
}

async function deleteLinked(
  payload: Payload,
  newsId: string,
  context?: Record<string, unknown>,
) {
  const existing = await findAllLinked(payload, newsId);
  for (const doc of existing) {
    await payload.delete({
      collection: "gallery",
      id: doc.id,
      overrideAccess: true,
      context: { ...context, skipGallerySync: true, disableRevalidate: true },
    });
  }
}

async function mediaTitle(payload: Payload, imageId: string, fallback: string) {
  try {
    const media = await payload.findByID({
      collection: "media",
      id: imageId,
      depth: 0,
      overrideAccess: true,
    });
    if (typeof media?.alt === "string" && media.alt.trim()) {
      return media.alt.trim().slice(0, 60);
    }
  } catch {
    // Media may have been removed; fall back to the story title.
  }
  return fallback;
}

/**
 * Sync every published-news cover + Photos-tab image into Gallery.
 * Returns how many gallery rows are linked to this story afterward.
 */
export async function upsertNewsGallery(
  payload: Payload,
  doc: NewsLike,
  context: Record<string, unknown> = {},
): Promise<number> {
  const newsId = String(doc.id);
  const imageIds = newsGalleryImageIds(doc);
  const writeContext = { ...context, skipGallerySync: true, disableRevalidate: true };

  if (!imageIds.length) {
    await deleteLinked(payload, newsId, context);
    return 0;
  }

  const storyTitle =
    typeof doc.title === "string" && doc.title.trim()
      ? doc.title.trim().slice(0, 60)
      : "News story";
  const note =
    typeof doc.excerpt === "string" ? doc.excerpt.slice(0, 160) : "";
  const category = galleryCategory(doc.category);
  const keepKeys = new Set(imageIds.map((id) => sourceKey(newsId, id)));

  for (let index = 0; index < imageIds.length; index += 1) {
    const imageId = imageIds[index];
    const key = sourceKey(newsId, imageId);
    const isCover = index === 0 && mediaId(doc.heroImage) === imageId;
    const title = isCover
      ? storyTitle
      : await mediaTitle(payload, imageId, storyTitle);

    const data = {
      image: imageId,
      title,
      note,
      fit: "cover" as const,
      category,
      destination: "news" as const,
      news: newsId,
      sourceNews: newsId,
      sourceKey: key,
      place: "",
    };

    const existing = await findBySourceKey(payload, key);
    if (existing) {
      await payload.update({
        collection: "gallery",
        id: existing.id,
        data,
        overrideAccess: true,
        context: writeContext,
      });
    } else {
      await payload.create({
        collection: "gallery",
        data,
        overrideAccess: true,
        context: writeContext,
      });
    }
  }

  // Drop synced rows whose media was removed from the story.
  const linked = await findAllLinked(payload, newsId);
  for (const row of linked) {
    const key = typeof row.sourceKey === "string" ? row.sourceKey : "";
    if (key && keepKeys.has(key)) continue;

    const rowImage = mediaId(row.image);
    // Legacy rows (no sourceKey yet) that still match a current image — stamp the key.
    if (!key && rowImage && imageIds.includes(rowImage)) {
      await payload.update({
        collection: "gallery",
        id: row.id,
        data: { sourceKey: sourceKey(newsId, rowImage) },
        overrideAccess: true,
        context: writeContext,
      });
      continue;
    }

    await payload.delete({
      collection: "gallery",
      id: row.id,
      overrideAccess: true,
      context: writeContext,
    });
  }

  return imageIds.length;
}

/** Keep Gallery rows in sync with each published news cover + extra photos. */
export const syncNewsGallery: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (req.context?.skipGallerySync) return doc;

  const newsId = String(doc.id);
  const isPublished = doc._status === "published";
  const wasPublished = previousDoc?._status === "published";

  if (!isPublished) {
    if (wasPublished) {
      await deleteLinked(req.payload, newsId, req.context as Record<string, unknown>);
    }
    return doc;
  }

  await upsertNewsGallery(req.payload, doc as NewsLike, req.context as Record<string, unknown>);
  return doc;
};

export const syncNewsGalleryDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (req.context?.skipGallerySync) return doc;
  await deleteLinked(req.payload, String(doc.id), req.context as Record<string, unknown>);
  return doc;
};
