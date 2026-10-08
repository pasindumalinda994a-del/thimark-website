import type { CollectionConfig } from "payload";
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
    defaultColumns: ["image", "title", "category", "place", "updatedAt"],
    listSearchableFields: ["title", "note", "place"],
    description: "Photos in the /gallery reel. Drag rows to change the order they appear in.",
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
  ],
};
