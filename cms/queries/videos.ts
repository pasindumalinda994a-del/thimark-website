import type { Video } from "@/payload-types";
import type { NewsVideo } from "@/app/(frontend)/newsroom/videos";
import { isoDay, payloadClient } from "./payload";

function toRecord(doc: Video): NewsVideo | null {
  const youtubeId = typeof doc.youtubeId === "string" ? doc.youtubeId.trim() : "";
  if (!youtubeId) return null;
  return {
    id: String(doc.id),
    title: doc.title ?? "",
    date: isoDay(doc.date),
    youtubeId,
    blurb: doc.blurb ?? "",
  };
}

export async function getNewsVideos(): Promise<NewsVideo[]> {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "videos",
    where: { _status: { equals: "published" } },
    sort: "-date",
    depth: 0,
    limit: 100,
    pagination: false,
  });
  return result.docs.map(toRecord).filter((video): video is NewsVideo => Boolean(video));
}
