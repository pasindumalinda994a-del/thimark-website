"use client";

import { upload } from "@vercel/blob/client";
import { createEnquiry, type CreateEnquiryResult, type UploadedFile } from "@/app/(frontend)/enquire/actions";
import type { EnquiryFields } from "@/app/(frontend)/enquire/enquire";

type SubmitOptions = {
  uploadsEnabled: boolean;
  website?: string;
  onProgress?: (label: string) => void;
};

function blobPath(file: File) {
  const month = new Date().toISOString().slice(0, 7);
  const safe = file.name.replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-");
  return `enquiries/${month}/${safe}`;
}

async function uploadFiles(files: File[], onProgress?: (label: string) => void) {
  const uploaded: UploadedFile[] = [];
  for (const [index, file] of files.entries()) {
    onProgress?.(`Uploading ${index + 1}/${files.length}`);
    const blob = await upload(blobPath(file), file, {
      access: "public",
      handleUploadUrl: "/enquire/upload",
      multipart: file.size > 8 * 1024 * 1024,
    });
    uploaded.push({ name: file.name, type: file.type, size: file.size, url: blob.url });
  }
  return uploaded;
}

export async function submitEnquiry(
  fields: EnquiryFields,
  files: File[],
  { uploadsEnabled, website, onProgress }: SubmitOptions,
): Promise<CreateEnquiryResult> {
  let uploaded: UploadedFile[];
  if (files.length && uploadsEnabled) {
    try {
      uploaded = await uploadFiles(files, onProgress);
    } catch (error) {
      const reason = error instanceof Error && error.message ? ` (${error.message})` : "";
      return { ok: false, error: `A file couldn’t be uploaded${reason}. Remove it or try again.` };
    }
  } else {
    uploaded = files.map((file) => ({ name: file.name, type: file.type, size: file.size }));
  }

  onProgress?.("Sending");
  try {
    return await createEnquiry({ fields, files: uploaded, website });
  } catch {
    return { ok: false, error: "We couldn’t reach the server. Check your connection and try again." };
  }
}
