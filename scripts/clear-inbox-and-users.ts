/**
 * Delete all enquiries + their Blob attachments, and all CMS users.
 * Leaves news, gallery, and media untouched.
 *
 * Recreates the first admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD when set.
 *
 * Usage: npm run clear:inbox-users
 */
import { del, list } from "@vercel/blob";
import { getPayload } from "payload";
import config from "../payload.config";

const context = { disableRevalidate: true, skipEnquiryEmail: true };

async function clearCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "enquiries" | "users",
) {
  let removed = 0;
  for (;;) {
    const batch = await payload.find({
      collection,
      limit: 100,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const doc of batch.docs) {
      await payload.delete({
        collection,
        id: doc.id,
        overrideAccess: true,
        context,
      });
      removed += 1;
    }
  }
  return removed;
}

async function clearEnquiryBlobs(token: string | undefined) {
  if (!token) {
    console.warn("BLOB_READ_WRITE_TOKEN missing — skipping Blob file cleanup under enquiries/");
    return 0;
  }

  let removed = 0;
  let cursor: string | undefined;
  for (;;) {
    const page = await list({
      prefix: "enquiries/",
      token,
      cursor,
      limit: 1000,
    });
    if (page.blobs.length > 0) {
      await del(
        page.blobs.map((blob) => blob.url),
        { token },
      );
      removed += page.blobs.length;
    }
    if (!page.hasMore) break;
    cursor = page.cursor;
  }
  return removed;
}

async function seedAdmin(payload: Awaited<ReturnType<typeof getPayload>>) {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    payload.logger.warn(
      "No SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD — create an admin at /admin (first user becomes admin).",
    );
    return;
  }

  await payload.create({
    collection: "users",
    data: {
      email,
      password,
      name: "Admin",
      role: "admin",
    },
    overrideAccess: true,
  });
  payload.logger.info(`Created admin ${email}`);
}

const payload = await getPayload({ config });

payload.logger.info("Deleting enquiry Blob files…");
const blobs = await clearEnquiryBlobs(process.env.BLOB_READ_WRITE_TOKEN);
payload.logger.info(`Removed ${blobs} Blob file(s) under enquiries/.`);

payload.logger.info("Deleting enquiries…");
const enquiries = await clearCollection(payload, "enquiries");
payload.logger.info(`Removed ${enquiries} enquiry(ies).`);

payload.logger.info("Deleting users…");
const users = await clearCollection(payload, "users");
payload.logger.info(`Removed ${users} user(s).`);

await seedAdmin(payload);

const news = await payload.count({ collection: "news", overrideAccess: true });
const gallery = await payload.count({ collection: "gallery", overrideAccess: true });
const media = await payload.count({ collection: "media", overrideAccess: true });
payload.logger.info(
  `Kept website content — news: ${news.totalDocs}, gallery: ${gallery.totalDocs}, media: ${media.totalDocs}.`,
);

process.exit(0);
