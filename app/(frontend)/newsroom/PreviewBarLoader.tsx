"use client";

import dynamic from "next/dynamic";

const PreviewBar = dynamic(() => import("@/app/(frontend)/newsroom/PreviewBar"), { ssr: false });

/** Keeps the live-preview client out of the article bundle; it only loads when a draft renders this. */
export default function PreviewBarLoader({ path }: { path: string }) {
  return <PreviewBar path={path} />;
}
