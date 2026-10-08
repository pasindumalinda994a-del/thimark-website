import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { payloadClient } from "@/cms/queries/payload";

function safePath(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export async function GET(request: NextRequest) {
  const path = safePath(request.nextUrl.searchParams.get("path"));
  if (!path) return new Response("Invalid preview path", { status: 400 });

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent(`/preview?path=${path}`)}`);
  }

  (await draftMode()).enable();
  redirect(path);
}
