/**
 * Re-upload Awards/CSR/Welfare gallery media via @vercel/blob put().
 * Payload Local API + clientUploads often records Blob URLs without uploading
 * the bytes — this writes the files directly with unique pathnames.
 *
 * Expects source JPGs at public/{Awards,CSR,Welfare}/...
 *
 * Usage: npx payload run scripts/repair-folder-gallery-blobs.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "../payload.config";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.BLOB_READ_WRITE_TOKEN;
const context = { disableRevalidate: true, skipGallerySync: true };

if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN is required");
  process.exit(1);
}

const BATCHES = [
  { id: "awards", dir: path.join(root, "public", "Awards", "Awards") },
  { id: "csr", dir: path.join(root, "public", "CSR", "CSR") },
  { id: "welfare", dir: path.join(root, "public", "Welfare", "Welfare") },
] as const;

function sourcePath(batchId: string, num: string) {
  const batch = BATCHES.find((b) => b.id === batchId);
  if (!batch) return null;
  for (const ext of [".jpg", ".jpeg", ".webp", ".png"]) {
    const candidate = path.join(batch.dir, `${num}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function parseSourceKey(key: unknown) {
  if (typeof key !== "string") return null;
  const match = /^folder:(awards|csr|welfare):(\d+)$/.exec(key);
  if (!match) return null;
  return { batchId: match[1], num: match[2] };
}

async function putWebp(pathname: string, buffer: Buffer, contentType = "image/webp") {
  return put(pathname, buffer, {
    access: "public",
    token,
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function buildRenditions(input: Buffer, base: string) {
  const meta = await sharp(input).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const mainBuf = await sharp(input)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86 })
    .toBuffer();
  const mainMeta = await sharp(mainBuf).metadata();
  const main = await putWebp(`${base}.webp`, mainBuf);

  const sizes: Record<
    string,
    { url: string; width: number; height: number; mimeType: string; filesize: number; filename: string }
  > = {};

  // thumb 400x300 centre crop
  {
    const buf = await sharp(input).rotate().resize(400, 300, { fit: "cover", position: "centre" }).webp({ quality: 80 }).toBuffer();
    const m = await sharp(buf).metadata();
    const blob = await putWebp(`${base}-400x300.webp`, buf);
    sizes.thumb = {
      url: blob.url,
      width: m.width ?? 400,
      height: m.height ?? 300,
      mimeType: "image/webp",
      filesize: buf.length,
      filename: `${base}-400x300.webp`,
    };
  }

  // card 960w (skip enlarge)
  if (width >= 960) {
    const buf = await sharp(input).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const m = await sharp(buf).metadata();
    const blob = await putWebp(`${base}-${m.width}x${m.height}.webp`, buf);
    sizes.card = {
      url: blob.url,
      width: m.width ?? 960,
      height: m.height ?? 0,
      mimeType: "image/webp",
      filesize: buf.length,
      filename: path.basename(blob.pathname),
    };
  }

  // hero 1920w (skip enlarge)
  if (width >= 1920) {
    const buf = await sharp(input).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
    const m = await sharp(buf).metadata();
    const blob = await putWebp(`${base}-${m.width}x${m.height}.webp`, buf);
    sizes.hero = {
      url: blob.url,
      width: m.width ?? 1920,
      height: m.height ?? 0,
      mimeType: "image/webp",
      filesize: buf.length,
      filename: path.basename(blob.pathname),
    };
  }

  // og jpeg 1200x630
  {
    const buf = await sharp(input).rotate().resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 82 }).toBuffer();
    const m = await sharp(buf).metadata();
    const blob = await put(`${base}-1200x630.jpg`, buf, {
      access: "public",
      token,
      contentType: "image/jpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    sizes.og = {
      url: blob.url,
      width: m.width ?? 1200,
      height: m.height ?? 630,
      mimeType: "image/jpeg",
      filesize: buf.length,
      filename: `${base}-1200x630.jpg`,
    };
  }

  return {
    url: main.url,
    filename: `${base}.webp`,
    mimeType: "image/webp",
    filesize: mainBuf.length,
    width: mainMeta.width ?? width,
    height: mainMeta.height ?? height,
    sizes,
  };
}

async function urlOk(url: string | null | undefined, attempts = 4) {
  if (!url) return false;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" } });
      if (res.ok || res.status === 206) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  return false;
}

const payload = await getPayload({ config });

const gallery = await payload.find({
  collection: "gallery",
  depth: 1,
  limit: 300,
  pagination: false,
  overrideAccess: true,
});

const folderDocs = gallery.docs.filter(
  (doc) => typeof doc.sourceKey === "string" && doc.sourceKey.startsWith("folder:"),
);

let repaired = 0;
let skipped = 0;
let failed = 0;

for (const doc of folderDocs) {
  const parsed = parseSourceKey(doc.sourceKey);
  if (!parsed) {
    skipped += 1;
    continue;
  }

  const pad = parsed.num.padStart(2, "0");
  const base = `gallery-${parsed.batchId}-${pad}`;
  const media = doc.image;
  const currentUrl =
    media && typeof media === "object" && typeof media.url === "string" ? media.url : null;

  if (currentUrl?.includes(`/${base}.`) && (await urlOk(currentUrl))) {
    skipped += 1;
    continue;
  }

  const filePath = sourcePath(parsed.batchId, parsed.num);
  if (!filePath) {
    payload.logger.error(`missing source for ${doc.sourceKey}`);
    failed += 1;
    continue;
  }

  const alt =
    typeof media === "object" && media && typeof media.alt === "string" && media.alt.trim()
      ? media.alt
      : doc.title;

  try {
    const input = fs.readFileSync(filePath);
    const upload = await buildRenditions(input, base);

    let mediaId: string | number;
    if (media && typeof media === "object" && media.id) {
      mediaId = media.id;
      await payload.update({
        collection: "media",
        id: mediaId,
        data: {
          alt,
          url: upload.url,
          filename: upload.filename,
          mimeType: upload.mimeType,
          filesize: upload.filesize,
          width: upload.width,
          height: upload.height,
          sizes: upload.sizes,
        },
        overrideAccess: true,
        context,
        // Skip Payload file pipeline — bytes already on Blob.
        file: undefined,
      });
    } else {
      const created = await payload.create({
        collection: "media",
        data: {
          alt,
          url: upload.url,
          filename: upload.filename,
          mimeType: upload.mimeType,
          filesize: upload.filesize,
          width: upload.width,
          height: upload.height,
          sizes: upload.sizes,
        },
        overrideAccess: true,
        context,
      });
      mediaId = created.id;
      await payload.update({
        collection: "gallery",
        id: doc.id,
        data: { image: mediaId },
        overrideAccess: true,
        context,
      });
    }

    // Ensure gallery points at this media (in case relation drifted).
    await payload.update({
      collection: "gallery",
      id: doc.id,
      data: { image: mediaId },
      overrideAccess: true,
      context,
    });

    const ok = await urlOk(upload.url);
    if (!ok) {
      throw new Error(`blob put reported ${upload.url} but GET failed`);
    }

    repaired += 1;
    payload.logger.info(`repaired ${doc.sourceKey} → ${upload.filename}`);
  } catch (error) {
    failed += 1;
    payload.logger.error({ err: error, msg: `failed ${doc.sourceKey}` });
  }
}

console.log(JSON.stringify({ folderDocs: folderDocs.length, repaired, skipped, failed }, null, 2));
process.exit(failed ? 1 : 0);
