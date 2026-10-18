import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Public files keep stable names, so cache them for a day and refresh in the background.
const PUBLIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";
const PUBLIC_ASSET_DIRS = ["brand", "pages"];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async headers() {
    return PUBLIC_ASSET_DIRS.map((dir) => ({
      source: `/${encodeURI(dir)}/:path*`,
      headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }],
    }));
  },
  async redirects() {
    return [
      { source: "/contact", destination: "/enquire", permanent: true },
      { source: "/request-a-quote", destination: "/enquire", permanent: true },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
