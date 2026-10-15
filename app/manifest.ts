import type { MetadataRoute } from "next";
import { COMPANY } from "@/app/(frontend)/components/site";
import { DEFAULT_DESCRIPTION } from "@/app/(frontend)/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.name,
    short_name: COMPANY.shortName,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#575757",
    theme_color: "#575757",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
