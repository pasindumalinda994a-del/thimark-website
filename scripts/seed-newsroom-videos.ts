/**
 * Seed published sample YouTube clips for /newsroom.
 *
 * Usage: npx payload run scripts/seed-newsroom-videos.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";

const SAMPLES = [
  {
    title: "KILGHARRAH 600 — project brief",
    blurb: "How the trash rack cleaner for KenGen moved from shop floor to site.",
    date: "2025-09-12T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
  {
    title: "Fabrication on the floor",
    blurb: "Weld, machine, and assemble — a short look through the works.",
    date: "2025-06-18T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
  },
  {
    title: "Export dispatch, Port of Colombo",
    blurb: "Crated, sealed, and leaving Sri Lanka for an overseas hydropower site.",
    date: "2025-04-03T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
  },
  {
    title: "SLTC innovation awards",
    blurb: "Recognition for engineering work built and proven at home.",
    date: "2024-11-22T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
  {
    title: "Sluice gate commission",
    blurb: "First water through a custom gate after installation and dry runs.",
    date: "2024-08-09T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=C0DPdy98e4c",
  },
] as const;

const payload = await getPayload({ config });
console.log("[seed-videos] connected");

const existing = await payload.find({
  collection: "videos",
  limit: 200,
  depth: 0,
  pagination: false,
  overrideAccess: true,
  draft: true,
});

console.log(`[seed-videos] existing docs: ${existing.docs.length}`);

if (existing.docs.length > 0) {
  console.log("[seed-videos] already seeded — skipping create");
  for (const doc of existing.docs) {
    console.log(`  - ${doc.title} [${doc._status}] id=${doc.youtubeId}`);
  }
  process.exit(0);
}

async function createWithRetry(sample: (typeof SAMPLES)[number], attempts = 4) {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await payload.create({
        collection: "videos",
        data: {
          ...sample,
          _status: "published",
        },
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
    } catch (error) {
      lastError = error;
      console.warn(`[seed-videos] retry ${i + 1}/${attempts} for “${sample.title}”`);
      await new Promise((resolve) => setTimeout(resolve, 750 * (i + 1)));
    }
  }
  throw lastError;
}

for (const sample of SAMPLES) {
  const doc = await createWithRetry(sample);
  console.log(`[seed-videos] published “${doc.title}” (${doc.youtubeId})`);
}

console.log(`[seed-videos] done — ${SAMPLES.length} videos`);
process.exit(0);
