import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async redirects() {
    return [
      { source: "/contact", destination: "/enquire", permanent: true },
      { source: "/request-a-quote", destination: "/enquire", permanent: true },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
