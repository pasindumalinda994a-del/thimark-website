import type { Gallery } from "@/payload-types";
import type { GalleryFrame } from "@/app/(frontend)/gallery/records";
import { mediaAlt, mediaUrl, payloadClient } from "./payload";

function toFrame(doc: Gallery): GalleryFrame {
  return {
    id: String(doc.id),
    title: doc.title,
    category: doc.category,
    note: doc.note ?? "",
    image: mediaUrl(doc.image, "hero"),
    alt: mediaAlt(doc.image) || doc.title,
    fit: doc.fit,
    place: doc.place ?? "",
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
