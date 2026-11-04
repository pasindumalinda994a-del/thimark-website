/**
 * Seed published YouTube clips from @Thimark-x1r for /newsroom.
 *
 * Upserts by youtubeId. Removes the old placeholder sample IDs if present.
 *
 * Usage: npx payload run scripts/seed-newsroom-videos.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { parseYoutubeId } from "../cms/collections/Videos";

const SAMPLES = [
  {
    title: "Engineering Sri Lanka's Future",
    blurb:
      "Thimark in under a minute — ISO-certified engineering from Sri Lanka, built for industry at home and abroad.",
    date: "2026-11-04T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=3Oz2BXa7U2k",
  },
  {
    title: "Our Quality - Measured. Tested. Certified.",
    blurb:
      "Inspection, testing, and ISO 9001:2015 discipline — how every component earns its place on the line.",
    date: "2026-11-03T12:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=FnQmJFP_PK0",
  },
  {
    title: "Our Strength - People & Partnerships",
    blurb:
      "The teams and OEM partners — Bajaj, Senaro, Ranomoto — that keep Sri Lankan motorcycle assembly moving.",
    date: "2026-11-03T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=KLvj9Lw1Dlc",
  },
  {
    title: "Our Muscle - Precision That Performs",
    blurb:
      "Fabrication capacity on the shop floor — weld, machine, and assemble work that holds under load.",
    date: "2026-11-02T12:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=eq5g2bIyumE",
  },
  {
    title: "Our Brain - Where Ideas Become Machines",
    blurb:
      "From drawing and 3D scan to a finished machine — how Thimark turns briefs into working hardware.",
    date: "2026-11-02T00:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=XOBve5G6aws",
  },
] as const;

/** Old placeholder clips from the first seed — safe to delete on re-run. */
const PLACEHOLDER_IDS = new Set([
  "aqz-KE-bpKQ",
  "M7lc1UVf-VE",
  "LXb3EKWsInQ",
  "jNQXAC9IVRw",
  "C0DPdy98e4c",
]);

function youtubeIdFromSample(sample: (typeof SAMPLES)[number]): string {
  const id = parseYoutubeId(sample.youtubeUrl);
  if (!id) throw new Error(`Invalid YouTube URL in seed: ${sample.youtubeUrl}`);
  return id;
}

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

let removed = 0;
for (const doc of existing.docs) {
  const id = typeof doc.youtubeId === "string" ? doc.youtubeId.trim() : "";
  if (!PLACEHOLDER_IDS.has(id)) continue;
  await payload.delete({
    collection: "videos",
    id: doc.id,
    overrideAccess: true,
    context: { disableRevalidate: true },
  });
  removed += 1;
  console.log(`[seed-videos] removed placeholder “${doc.title}” (${id})`);
}

const remaining = await payload.find({
  collection: "videos",
  limit: 200,
  depth: 0,
  pagination: false,
  overrideAccess: true,
  draft: true,
});

const byYoutubeId = new Map(
  remaining.docs
    .map((doc) => {
      const id = typeof doc.youtubeId === "string" ? doc.youtubeId.trim() : "";
      return id ? ([id, doc] as const) : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
);

async function withRetry<T>(label: string, run: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      console.warn(`[seed-videos] retry ${i + 1}/${attempts} for “${label}”`);
      await new Promise((resolve) => setTimeout(resolve, 750 * (i + 1)));
    }
  }
  throw lastError;
}

let created = 0;
let updated = 0;

for (const sample of SAMPLES) {
  const youtubeId = youtubeIdFromSample(sample);
  const match = byYoutubeId.get(youtubeId);
  const data = {
    ...sample,
    _status: "published" as const,
  };

  if (match) {
    const doc = await withRetry(sample.title, () =>
      payload.update({
        collection: "videos",
        id: match.id,
        data,
        overrideAccess: true,
        context: { disableRevalidate: true },
      }),
    );
    updated += 1;
    console.log(`[seed-videos] updated “${doc.title}” (${youtubeId})`);
  } else {
    const doc = await withRetry(sample.title, () =>
      payload.create({
        collection: "videos",
        data,
        overrideAccess: true,
        context: { disableRevalidate: true },
      }),
    );
    created += 1;
    console.log(`[seed-videos] published “${doc.title}” (${youtubeId})`);
  }
}

console.log(
  `[seed-videos] done — created ${created}, updated ${updated}, removed placeholders ${removed}`,
);
process.exit(0);
