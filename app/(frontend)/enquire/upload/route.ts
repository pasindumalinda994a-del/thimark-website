import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { MAX_FILE_MB, UPLOAD_FORMATS, fileExt } from "@/app/(frontend)/enquire/enquire";
import { clientIp, rateLimit } from "@/cms/rateLimit";

const FORMATS = new Set(UPLOAD_FORMATS);

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "File uploads are not configured" }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!rateLimit(`upload:${clientIp(request.headers)}`, 60, 10 * 60 * 1000)) {
          throw new Error("Too many uploads. Try again in a few minutes.");
        }
        if (!pathname.startsWith("enquiries/") || !FORMATS.has(fileExt(pathname))) {
          throw new Error("That file type isn’t supported");
        }
        return {
          maximumSizeInBytes: MAX_FILE_MB * 1024 * 1024,
          addRandomSuffix: true,
          validUntil: Date.now() + 15 * 60 * 1000,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
