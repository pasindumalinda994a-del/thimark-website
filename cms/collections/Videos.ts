import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { revalidateVideos, revalidateVideosDelete } from "../hooks/revalidate";
import { previewPath } from "../preview";

const YOUTUBE_ID = /^[\w-]{11}$/;

/** Extract an 11-character YouTube video id from a URL or bare id. */
export function parseYoutubeId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (YOUTUBE_ID.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.slice(0, 11);
      return id && YOUTUBE_ID.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID.test(fromQuery)) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) => part === "embed" || part === "shorts" || part === "live");
      if (embedIndex >= 0) {
        const id = parts[embedIndex + 1]?.slice(0, 11);
        return id && YOUTUBE_ID.test(id) ? id : null;
      }
    }
  } catch {
    // not a URL
  }

  return null;
}

const setYoutubeId: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data;
  const raw = typeof data.youtubeUrl === "string" ? data.youtubeUrl : "";
  const id = parseYoutubeId(raw);
  if (id) {
    data.youtubeId = id;
    if (YOUTUBE_ID.test(raw.trim())) {
      data.youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
    }
  }
  return data;
};

const counter = (max: number) => ({
  Field: {
    path: "/cms/admin/fields/CountedField#CountedField",
    clientProps: { max },
  },
});

export const Videos: CollectionConfig = {
  slug: "videos",
  labels: { singular: "Video", plural: "Videos" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "date", "_status", "updatedAt"],
    listSearchableFields: ["title", "blurb", "youtubeId"],
    description: "YouTube clips shown in the Videos section on /newsroom. Publish to appear on the site.",
    preview: () => previewPath("/newsroom#newsroom-videos"),
    livePreview: {
      url: () => previewPath("/newsroom#newsroom-videos"),
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
    beforeChange: [setYoutubeId],
    afterChange: [revalidateVideos],
    afterDelete: [revalidateVideosDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 120,
      admin: { components: counter(120) },
    },
    {
      name: "blurb",
      type: "textarea",
      required: true,
      maxLength: 240,
      admin: {
        rows: 3,
        description: "One or two sentences under the title on the newsroom grid.",
        components: counter(240),
      },
    },
    {
      name: "youtubeUrl",
      label: "YouTube link",
      type: "text",
      required: true,
      validate: (value: string | null | undefined) => {
        if (typeof value !== "string" || !value.trim()) return "Paste a YouTube link or video id";
        return parseYoutubeId(value) ? true : "Enter a valid YouTube URL or 11-character video id";
      },
      admin: {
        placeholder: "https://www.youtube.com/watch?v=… or youtu.be/…",
        description: "Paste a full YouTube URL or the 11-character video id.",
      },
    },
    {
      name: "youtubeId",
      type: "text",
      index: true,
      admin: {
        readOnly: true,
        description: "Normalized from the link above on save.",
      },
    },
    {
      name: "date",
      label: "Clip date",
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
