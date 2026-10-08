import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("path");
  const path = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/newsroom";
  (await draftMode()).disable();
  redirect(path);
}
