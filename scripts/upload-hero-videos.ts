/**
 * Upload homepage hero clips to public Vercel Blob and rewrite HERO_VIDEOS
 * in app/(frontend)/homesections/heroClips.ts.
 *
 * Usage: npm run upload:hero-videos
 * Requires BLOB_READ_WRITE_TOKEN in .env (public Blob store).
 *
 * Source files: scripts/hero-source/hero-1.mp4 … hero-5.mp4
 * (falls back to public/videos/ if that folder still exists)
 *
 * Deletes existing blobs under the hero/ prefix, then uploads to
 * hero/final/hero-{n}.mp4 so CDN cache is busted by new URLs.
 */
import { readFileSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { del, list, put } from "@vercel/blob";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLIP_COUNT = 5;
const CACHE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const BLOB_PREFIX = "hero/";
const BLOB_UPLOAD_PREFIX = "hero/final";
const HERO_CLIPS_PATH = path.join(root, "app/(frontend)/homesections/heroClips.ts");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function sourceDir() {
  const preferred = path.join(root, "scripts/hero-source");
  const fallback = path.join(root, "public/videos");
  if (existsSync(preferred) && readdirSync(preferred).some((f) => /^hero-\d+\.mp4$/i.test(f))) {
    return preferred;
  }
  if (existsSync(fallback) && readdirSync(fallback).some((f) => /^hero-\d+\.mp4$/i.test(f))) {
    return fallback;
  }
  return preferred;
}

function rewriteHeroClips(urls: string[]) {
  const source = readFileSync(HERO_CLIPS_PATH, "utf8");
  const block = [
    "/** One source file per reel station (public Vercel Blob). */",
    "const HERO_VIDEOS = [",
    ...urls.map((url) => `  { mp4: ${JSON.stringify(url)} },`),
    "] as const satisfies readonly HeroVideo[];",
  ].join("\n");

  const next = source.replace(
    /\/\*\* One source file per reel station[\s\S]*?\] as const satisfies readonly HeroVideo\[\];/,
    block,
  );

  if (next === source) {
    throw new Error(`Could not find HERO_VIDEOS block to rewrite in ${HERO_CLIPS_PATH}`);
  }
  writeFileSync(HERO_CLIPS_PATH, next);
}

async function deleteExistingHeroBlobs(token: string) {
  console.log(`Removing existing blobs under ${BLOB_PREFIX} …`);
  let cursor: string | undefined;
  let removed = 0;

  do {
    const page = await list({
      prefix: BLOB_PREFIX,
      cursor,
      token,
    });

    if (page.blobs.length > 0) {
      const urls = page.blobs.map((blob) => blob.url);
      await del(urls, { token });
      removed += urls.length;
      for (const blob of page.blobs) {
        console.log(`  deleted ${blob.pathname}`);
      }
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  if (removed === 0) {
    console.log("  (none found)");
  } else {
    console.log(`  removed ${removed} blob(s)`);
  }
}

async function main() {
  loadEnv();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN is missing. Add it to .env (public Blob store).");
    process.exit(1);
  }

  const dir = sourceDir();
  const urls: string[] = [];

  await deleteExistingHeroBlobs(token);

  console.log(`Uploading hero clips from ${path.relative(root, dir)} → ${BLOB_UPLOAD_PREFIX}/ …`);

  for (let i = 1; i <= CLIP_COUNT; i++) {
    const filename = `hero-${i}.mp4`;
    const filePath = path.join(dir, filename);
    if (!existsSync(filePath)) {
      console.error(`Missing ${filePath}`);
      process.exit(1);
    }

    const pathname = `${BLOB_UPLOAD_PREFIX}/${filename}`;
    const body = readFileSync(filePath);
    const result = await put(pathname, body, {
      access: "public",
      token,
      contentType: "video/mp4",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: CACHE_MAX_AGE,
    });

    urls.push(result.url);
    console.log(`  ${filename} → ${result.url} (${(body.length / 1024 / 1024).toFixed(2)} MB)`);
  }

  rewriteHeroClips(urls);
  console.log(`\nUpdated ${path.relative(root, HERO_CLIPS_PATH)}`);
  console.log("Done. Keep higher-quality masters in scripts/hero-source/ (gitignored) and re-run to replace Blob.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
