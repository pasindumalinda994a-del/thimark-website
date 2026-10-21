import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from "payload";

type Target = { path: string; type?: "page" | "layout" };

async function revalidate(req: PayloadRequest, targets: Target[]) {
  if (req.context?.disableRevalidate) return;
  try {
    const { revalidatePath } = await import("next/cache");
    for (const target of targets) revalidatePath(target.path, target.type);
  } catch (error) {
    // revalidatePath only works inside a Next.js request (not in `payload run` scripts)
    req.payload.logger.debug({ msg: "Skipped revalidation", err: error });
  }
}

const NEWS_TARGETS: Target[] = [
  { path: "/newsroom" },
  { path: "/newsroom/[slug]", type: "page" },
  { path: "/sitemap.xml" },
];

const GALLERY_TARGETS: Target[] = [{ path: "/gallery" }];

export const revalidateNews: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (doc?._status === "published" || previousDoc?._status === "published") {
    // Gallery sync disables per-row revalidation; always refresh both surfaces here.
    const skipped = Boolean(req.context?.disableRevalidate);
    if (req.context && skipped) req.context.disableRevalidate = false;
    await revalidate(req, [...NEWS_TARGETS, ...GALLERY_TARGETS]);
    if (req.context && skipped) req.context.disableRevalidate = true;
  }
  return doc;
};

export const revalidateNewsDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidate(req, [...NEWS_TARGETS, ...GALLERY_TARGETS]);
  return doc;
};

export const revalidateGallery: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidate(req, GALLERY_TARGETS);
  return doc;
};

export const revalidateGalleryDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidate(req, GALLERY_TARGETS);
  return doc;
};

export const revalidateMedia: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === "update") await revalidate(req, [...NEWS_TARGETS, ...GALLERY_TARGETS]);
  return doc;
};
