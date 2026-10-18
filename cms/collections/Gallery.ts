import type { CollectionConfig } from "payload";
import { GALLERY_PAGE_OPTIONS } from "../../app/(frontend)/gallery/destinations";
import { GALLERY_CATEGORIES } from "../../app/(frontend)/gallery/records";
import { anyone, authenticated } from "../access";
import { revalidateGallery, revalidateGalleryDelete } from "../hooks/revalidate";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "Photo", plural: "Gallery" },
  orderable: true,
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["image", "title", "destination", "category", "updatedAt"],
    listSearchableFields: ["title", "note", "place"],
    description:
      "Each photo on /gallery sends visitors to a site page or news story. Drag rows to change the order. Prefer linking over Unlinked when the photo belongs to content.",
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateGallery],
    afterDelete: [revalidateGalleryDelete],
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Alt text comes from the image in the media library." },
    },
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, maxLength: 60, admin: { width: "50%" } },
        {
          name: "place",
          type: "text",
          admin: { width: "50%", placeholder: "Kadawatha", description: "Short location or moment tag." },
        },
      ],
    },
    {
      name: "note",
      label: "Caption",
      type: "textarea",
      maxLength: 160,
      admin: { rows: 2, description: "One line shown beside the photo." },
    },
    {
      name: "fit",
      label: "Framing",
      type: "radio",
      required: true,
      defaultValue: "cover",
      options: [
        { label: "Fill the frame (crops edges)", value: "cover" },
        { label: "Show the whole image (logos, trophies, documents)", value: "contain" },
      ],
      admin: { layout: "vertical" },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "manufacturing",
      options: GALLERY_CATEGORIES.map((category) => ({ label: category.full, value: category.id })),
      admin: { position: "sidebar" },
    },
    {
      name: "destination",
      label: "Destination",
      type: "radio",
      required: true,
      defaultValue: "none",
      options: [
        { label: "Site page", value: "page" },
        { label: "News story", value: "news" },
        { label: "Unlinked (no click-through)", value: "none" },
      ],
      admin: {
        position: "sidebar",
        layout: "vertical",
        description:
          "Where a click on /gallery should go. Unlinked photos stay in the reel but do not open a page.",
      },
    },
    {
      name: "page",
      label: "Site page",
      type: "select",
      options: GALLERY_PAGE_OPTIONS,
      admin: {
        position: "sidebar",
        condition: (_, siblingData) => siblingData?.destination === "page",
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { destination?: string } }) => {
        if (siblingData?.destination === "page" && !value) return "Pick a site page";
        return true;
      },
    },
    {
      name: "news",
      label: "News story",
      type: "relationship",
      relationTo: "news",
      admin: {
        position: "sidebar",
        description: "Prefer a published story so the link works for visitors.",
        condition: (_, siblingData) => siblingData?.destination === "news",
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { destination?: string } }) => {
        if (siblingData?.destination === "news" && !value) return "Pick a news story";
        return true;
      },
    },
    {
      name: "sourceNews",
      label: "Synced from news",
      type: "relationship",
      relationTo: "news",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Filled automatically when a news cover or story photo is published.",
        condition: (_, siblingData) => Boolean(siblingData?.sourceNews),
      },
    },
    {
      name: "sourceKey",
      type: "text",
      unique: true,
      index: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
};
