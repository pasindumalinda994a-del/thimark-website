import type { CollectionConfig, FieldHook } from "payload";
import { NEWS_CATEGORIES } from "../../app/(frontend)/newsroom/records";
import { authenticated, publishedOrAuthenticated } from "../access";
import { revalidateNews, revalidateNewsDelete } from "../hooks/revalidate";
import { previewPath } from "../preview";
import { slugify } from "../slugify";

const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (typeof value === "string" && value.trim()) return slugify(value);
  const title = data?.title ?? originalDoc?.title;
  const fromTitle = typeof title === "string" ? slugify(title) : "";
  return fromTitle || originalDoc?.slug || `story-${Date.now().toString(36)}`;
};

const counter = (max: number) => ({
  Field: {
    path: "/cms/admin/fields/CountedField#CountedField",
    clientProps: { max },
  },
});

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News story", plural: "Newsroom" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date", "_status", "updatedAt"],
    listSearchableFields: ["title", "excerpt", "slug"],
    description: "Stories published at /newsroom. Save a draft to preview it before publishing.",
    preview: (doc) => (doc?.slug ? previewPath(`/newsroom/${doc.slug}`) : null),
    livePreview: {
      url: ({ data }) => (data?.slug ? previewPath(`/newsroom/${data.slug}`) : ""),
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 820, height: 1180 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
    pagination: { defaultLimit: 25 },
  },
  defaultSort: "-date",
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    maxPerDoc: 25,
    drafts: {
      schedulePublish: true,
    },
  },
  hooks: {
    afterChange: [revalidateNews],
    afterDelete: [revalidateNewsDelete],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Story",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              maxLength: 120,
              admin: { components: counter(120) },
            },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              maxLength: 240,
              admin: {
                rows: 3,
                description: "One or two sentences shown on the newsroom card and article header.",
                components: counter(240),
              },
            },
            {
              name: "heroImage",
              label: "Cover image",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: { description: "The main photograph at the top of the story and on its card." },
            },
            {
              name: "body",
              label: "Sections",
              type: "array",
              required: true,
              minRows: 1,
              labels: { singular: "Section", plural: "Sections" },
              admin: {
                description: "Each section becomes a numbered entry in the article contents list.",
                components: {
                  RowLabel: "/cms/admin/fields/SectionRowLabel#SectionRowLabel",
                },
              },
              fields: [
                { name: "heading", type: "text", required: true },
                { name: "text", type: "textarea", required: true, admin: { rows: 4 } },
                {
                  type: "row",
                  fields: [
                    {
                      name: "href",
                      label: "Link URL",
                      type: "text",
                      admin: { width: "60%", placeholder: "https://" },
                      validate: (value: string | null | undefined) => {
                        if (!value) return true;
                        try {
                          const url = new URL(value);
                          return url.protocol === "https:" || url.protocol === "http:"
                            ? true
                            : "Use an http(s) link";
                        } catch {
                          return "Enter a full URL, starting with https://";
                        }
                      },
                    },
                    {
                      name: "hrefLabel",
                      label: "Link label",
                      type: "text",
                      admin: { width: "40%", placeholder: "Open" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Photos",
          description: "Extra photographs shown in a grid below the story.",
          fields: [
            {
              name: "images",
              label: "Photographs",
              type: "upload",
              relationTo: "media",
              hasMany: true,
            },
          ],
        },
        {
          name: "seo",
          label: "SEO",
          description:
            "Optional overrides for search results and social shares. Left blank, the title, excerpt and cover image are used.",
          fields: [
            {
              name: "metaTitle",
              label: "Search title",
              type: "text",
              maxLength: 60,
              admin: {
                description: "Shown as the Google result title, followed by \u201c| Thimark\u201d.",
                components: counter(60),
              },
            },
            {
              name: "metaDescription",
              label: "Search description",
              type: "textarea",
              maxLength: 160,
              admin: {
                rows: 3,
                description: "The snippet under the result title. Aim for 120\u2013155 characters.",
                components: counter(160),
              },
            },
            {
              name: "ogImage",
              label: "Share image",
              type: "upload",
              relationTo: "media",
              admin: { description: "Shown when the story is shared on social media. Landscape, ideally 1200\u00d7630." },
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlug] },
      admin: {
        position: "sidebar",
        description: "URL: /newsroom/<slug>. Generated from the title when left blank.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "company",
      options: NEWS_CATEGORIES.map((category) => ({ label: category.full, value: category.id })),
      admin: { position: "sidebar" },
    },
    {
      name: "date",
      label: "Story date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      },
    },
  ],
};
