import type { Gallery, News } from "@/payload-types";
import { pageHref, pageLabel } from "@/app/(frontend)/gallery/destinations";
import type { GalleryFrame } from "@/app/(frontend)/gallery/records";
import { mediaAlt, mediaUrl, payloadClient } from "./payload";

function newsSlug(value: Gallery["news"] | Gallery["sourceNews"]) {
  if (!value || typeof value !== "object") return "";
  const doc = value as News;
  return typeof doc.slug === "string" ? doc.slug : "";
}

function resolveDestination(doc: Gallery): Pick<GalleryFrame, "href" | "destinationLabel"> {
  if (doc.destination === "page") {
    const href = pageHref(doc.page);
    return { href, destinationLabel: pageLabel(doc.page) };
  }
  if (doc.destination === "news") {
    const slug = newsSlug(doc.news) || newsSlug(doc.sourceNews);
    if (!slug) return { href: null, destinationLabel: "News" };
    return { href: `/newsroom/${slug}`, destinationLabel: "News" };
  }
  return { href: null, destinationLabel: null };
}

function toFrame(doc: Gallery): GalleryFrame {
  const destination = resolveDestination(doc);
  return {
    id: String(doc.id),
    title: doc.title,
    category: doc.category,
    note: doc.note ?? "",
    image: mediaUrl(doc.image, "hero"),
    texture: mediaUrl(doc.image, "card") || mediaUrl(doc.image, "hero"),
    alt: mediaAlt(doc.image) || doc.title,
    fit: doc.fit,
    place: doc.place ?? "",
    href: destination.href,
    destinationLabel: destination.destinationLabel,
  };
}

export async function getGalleryFrames(): Promise<GalleryFrame[]> {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "gallery",
    sort: "_order",
    depth: 1,
    limit: 300,
    pagination: false,
  });
  return result.docs.map(toFrame).filter((frame) => frame.image);
}
