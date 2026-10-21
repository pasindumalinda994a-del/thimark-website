import config from "@payload-config";
import { getPayload } from "payload";
import type { Media } from "@/payload-types";
import { SERVER_URL } from "../preview";

export function payloadClient() {
  return getPayload({ config });
}

type ImageSize = keyof NonNullable<Media["sizes"]>;

function normalizeUrl(url: string) {
  const index = url.indexOf("?");
  const clean = index === -1 ? url : url.slice(0, index);
  return clean.startsWith(SERVER_URL) ? clean.slice(SERVER_URL.length) || "/" : clean;
}

export function mediaUrl(media: unknown, size?: ImageSize) {
  if (!media || typeof media !== "object") return "";
  const doc = media as Media;
  // Only use a size when it has a real URL — empty size stubs must fall through
  // to the original file (Payload leaves size objects with null url when skipped).
  const sized = size ? doc.sizes?.[size]?.url : undefined;
  const url = (typeof sized === "string" && sized) || doc.url;
  return typeof url === "string" && url ? normalizeUrl(url) : "";
}

export function mediaAlt(media: unknown) {
  if (!media || typeof media !== "object") return "";
  return (media as Media).alt ?? "";
}

export function isoDay(value: string, timeZone = "Asia/Colombo") {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(new Date(value));
}
