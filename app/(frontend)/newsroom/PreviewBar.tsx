"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default function PreviewBar({ path }: { path: string }) {
  const router = useRouter();

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={SERVER_URL} />
      <div
        role="status"
        className="index-tag fixed right-4 bottom-4 z-[60] flex items-center gap-4 bg-steel px-4 py-3 text-cream shadow-lg"
      >
        <span>Draft preview</span>
        <a href={`/preview/exit?path=${encodeURIComponent(path)}`} className="text-cream underline underline-offset-4">
          Exit
        </a>
      </div>
    </>
  );
}
