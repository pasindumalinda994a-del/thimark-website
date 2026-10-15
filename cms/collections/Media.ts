import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { admins, anyone, authenticated } from "../access";
import { revalidateMedia } from "../hooks/revalidate";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Media library" },
  admin: {
    group: "Content",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "filesize", "updatedAt"],
    description: "Every image used by the newsroom and gallery.",
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  hooks: {
    afterChange: [revalidateMedia],
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    crop: true,
    adminThumbnail: "thumb",
    formatOptions: { format: "webp", options: { quality: 86 } },
    resizeOptions: { width: 2560, height: 2560, fit: "inside", withoutEnlargement: true },
    imageSizes: [
      { name: "thumb", width: 400, height: 300, position: "centre", formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "card", width: 960, formatOptions: { format: "webp", options: { quality: 82 } } },
      { name: "hero", width: 1920, formatOptions: { format: "webp", options: { quality: 84 } } },
      // Social share cards; LinkedIn and some messengers do not render WebP previews.
      { name: "og", width: 1200, height: 630, position: "centre", formatOptions: { format: "jpeg", options: { quality: 82 } } },
    ],
  },
  fields: [
    {
      name: "alt",
      label: "Alt text",
      type: "text",
      required: true,
      admin: {
        description: "Describe what the photo shows for screen readers and search engines.",
      },
    },
  ],
};
