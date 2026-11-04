/**
 * Seed the Automechanika Dubai 2026 news story with its cover flyer.
 *
 * Upserts by slug. Re-runs replace the cover image with a fresh upload.
 *
 * Usage: npx payload run scripts/seed-automechanika-news.ts
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../payload.config";

const SLUG = "meet-thimark-at-automechanika-dubai-2026";
const COVER_ALT = "Thimark at Automechanika Dubai 2026 — Stall S-05318";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coverPath = path.join(
  root,
  "public",
  "News",
  "WhatsApp Image 2026-11-03 at 18.13.57.jpeg",
);

const ctx = { disableRevalidate: true };

const payload = await getPayload({ config });
console.log("[seed-automechanika] connected");

const media = await payload.create({
  collection: "media",
  filePath: coverPath,
  data: { alt: COVER_ALT },
  overrideAccess: true,
  context: ctx,
});
console.log(`[seed-automechanika] uploaded cover media ${media.id}`);

const storyData = {
  title: "Meet Thimark at Automechanika Dubai 2026",
  excerpt:
    "Join us at Stall S-05318, 10–12 November 2026, Dubai Exhibition Centre (DEC), Expo City Dubai.",
  slug: SLUG,
  category: "company" as const,
  date: "2026-11-04T00:00:00.000Z",
  heroImage: media.id,
  body: [
    {
      heading: "Event",
      text: "Thimark will be at Automechanika Dubai 2026. Meet our team to talk manufacturing, partnerships, and how we build for industry at home and abroad.",
    },
    {
      heading: "Visit us",
      text: "Find us at Stall S-05318 from 10–12 November 2026 at the Dubai Exhibition Centre (DEC), Expo City Dubai.",
    },
  ],
  _status: "published" as const,
};

const existing = await payload.find({
  collection: "news",
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
  draft: true,
});

const match = existing.docs[0];

if (match) {
  const doc = await payload.update({
    collection: "news",
    id: match.id,
    data: storyData,
    overrideAccess: true,
    context: ctx,
  });
  console.log(`[seed-automechanika] updated “${doc.title}” → /newsroom/${doc.slug}`);
} else {
  const doc = await payload.create({
    collection: "news",
    data: storyData,
    overrideAccess: true,
    context: ctx,
  });
  console.log(`[seed-automechanika] published “${doc.title}” → /newsroom/${doc.slug}`);
}

process.exit(0);
