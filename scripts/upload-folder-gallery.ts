/**
 * Upload Awards / CSR / Welfare folders into Media + Gallery,
 * linking each photo to the About page.
 *
 * Usage: npm run upload:gallery-folders
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload, type Payload } from "payload";
import config from "../payload.config";
import type { GalleryCategoryId, GalleryFit } from "../app/(frontend)/gallery/records";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { disableRevalidate: true };

type FolderBatch = {
  id: string;
  dir: string;
  titlePrefix: string;
  category: GalleryCategoryId;
  fit: GalleryFit;
  note: string;
  altPrefix: string;
};

const BATCHES: FolderBatch[] = [
  {
    id: "awards",
    dir: path.join(root, "public", "Awards", "Awards"),
    titlePrefix: "Award",
    category: "recognition",
    fit: "contain",
    note: "Recognition and awards.",
    altPrefix: "Thimark awards photo",
  },
  {
    id: "csr",
    dir: path.join(root, "public", "CSR", "CSR"),
    titlePrefix: "CSR",
    category: "people",
    fit: "cover",
    note: "Corporate social responsibility.",
    altPrefix: "Thimark CSR photo",
  },
  {
    id: "welfare",
    dir: path.join(root, "public", "Welfare", "Welfare"),
    titlePrefix: "Welfare",
    category: "people",
    fit: "cover",
    note: "Team welfare and community.",
    altPrefix: "Thimark welfare photo",
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function listImages(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => {
      const na = Number.parseInt(path.parse(a).name, 10);
      const nb = Number.parseInt(path.parse(b).name, 10);
      if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .map((name) => path.join(dir, name));
}

async function uploadImage(payload: Payload, filePath: string, alt: string) {
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    context,
  });
  return doc.id;
}

async function uploadBatch(payload: Payload, batch: FolderBatch) {
  const files = listImages(batch.dir);
  if (!files.length) {
    payload.logger.warn(`No images in ${batch.dir}`);
    return { created: 0, skipped: 0 };
  }

  let created = 0;
  let skipped = 0;

  for (const filePath of files) {
    const base = path.parse(filePath).name;
    const n = Number.parseInt(base, 10);
    const num = Number.isNaN(n) ? base : pad2(n);
    const sourceKey = `folder:${batch.id}:${base}`;
    const title = `${batch.titlePrefix} ${num}`;

    const existing = await payload.find({
      collection: "gallery",
      where: { sourceKey: { equals: sourceKey } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      payload.logger.info(`Skip "${title}" (${sourceKey})`);
      skipped += 1;
      continue;
    }

    const alt = `${batch.altPrefix} ${num}`;
    payload.logger.info(`Photo "${title}"`);
    const image = await uploadImage(payload, filePath, alt);
    await payload.create({
      collection: "gallery",
      data: {
        title,
        category: batch.category,
        note: batch.note,
        image,
        fit: batch.fit,
        place: "Kadawatha",
        destination: "page",
        page: "about",
        sourceKey,
      },
      context,
      overrideAccess: true,
    });
    created += 1;
  }

  return { created, skipped };
}

const payload = await getPayload({ config });
let created = 0;
let skipped = 0;

for (const batch of BATCHES) {
  payload.logger.info(`— ${batch.id} (${batch.dir})`);
  const result = await uploadBatch(payload, batch);
  created += result.created;
  skipped += result.skipped;
}

payload.logger.info(`Done. Created ${created}, skipped ${skipped}.`);
process.exit(0);
