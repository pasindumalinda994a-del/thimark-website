/**
 * Wipe all Gallery rows, then backfill every published news cover + Photos-tab image.
 * Page / unlinked photos are not created — add those manually when you want.
 *
 * Usage: npm run reset:gallery
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { upsertNewsGallery } from "../cms/hooks/syncNewsGallery";

const context = { disableRevalidate: true, skipGallerySync: true };

async function clearGallery(payload: Awaited<ReturnType<typeof getPayload>>) {
  let removed = 0;
  for (;;) {
    const batch = await payload.find({
      collection: "gallery",
      limit: 100,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const doc of batch.docs) {
      await payload.delete({
        collection: "gallery",
        id: doc.id,
        overrideAccess: true,
        context,
      });
      removed += 1;
    }
  }
  return removed;
}

async function backfillNews(payload: Awaited<ReturnType<typeof getPayload>>) {
  const news = await payload.find({
    collection: "news",
    where: { _status: { equals: "published" } },
    limit: 200,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });

  let photos = 0;
  let skipped = 0;
  for (const doc of news.docs) {
    const count = await upsertNewsGallery(payload, doc, context);
    if (count > 0) {
      photos += count;
      payload.logger.info(`  gallery ← “${doc.title}” (${count} photo${count === 1 ? "" : "s"})`);
    } else {
      skipped += 1;
      payload.logger.warn(`  skipped “${doc.title}” (no images)`);
    }
  }
  return { photos, skipped, stories: news.docs.length };
}

async function dropLegacyUniqueSourceNews(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  const db = payload.db.connection.db;
  if (!db) return;
  const col = db.collection("galleries");
  const indexes = await col.indexes();
  for (const idx of indexes) {
    if (idx.name === "_id_") continue;
    const keys = Object.keys(idx.key ?? {});
    if (keys.length === 1 && keys[0] === "sourceNews" && idx.unique && idx.name) {
      payload.logger.info(`Dropping legacy unique index ${idx.name}`);
      await col.dropIndex(idx.name);
    }
  }
}

const payload = await getPayload({ config });
await dropLegacyUniqueSourceNews(payload);
payload.logger.info("Clearing gallery…");
const removed = await clearGallery(payload);
payload.logger.info(`Removed ${removed} gallery photo(s).`);

payload.logger.info("Backfilling published news covers + story photos…");
const { photos, skipped, stories } = await backfillNews(payload);
payload.logger.info(
  `Done. ${photos} gallery photo(s) from ${stories} published stories${skipped ? ` (${skipped} without images)` : ""}.`,
);
payload.logger.info("Add unlinked page photos later in Content → Gallery when you want.");
process.exit(0);
