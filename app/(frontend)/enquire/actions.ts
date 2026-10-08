"use server";

import { headers } from "next/headers";
import type { Payload } from "payload";
import {
  MAX_FILES,
  MAX_FILE_MB,
  TOPICS,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryFields,
  type FileMeta,
} from "@/app/(frontend)/enquire/enquire";
import { payloadClient } from "@/cms/queries/payload";
import { clientIp, rateLimit } from "@/cms/rateLimit";

export type UploadedFile = FileMeta & { url?: string };

export type CreateEnquiryInput = {
  fields: EnquiryFields;
  files: UploadedFile[];
  /** Honeypot. Real visitors never see or fill this. */
  website?: string;
};

export type CreateEnquiryResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: EnquiryErrors };

const TOPIC_IDS = new Set<string>(TOPICS.map((topic) => topic.id));
const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/;

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanFiles(files: unknown): UploadedFile[] {
  if (!Array.isArray(files)) return [];
  return files.slice(0, MAX_FILES).flatMap((file) => {
    if (!file || typeof file !== "object") return [];
    const { name, type, size, url } = file as Record<string, unknown>;
    if (typeof name !== "string" || typeof size !== "number") return [];
    if (size < 0 || size > MAX_FILE_MB * 1024 * 1024) return [];
    let safeUrl: string | undefined;
    if (typeof url === "string") {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" && BLOB_HOST.test(parsed.hostname)) safeUrl = parsed.toString();
      } catch {
        safeUrl = undefined;
      }
    }
    return [{ name: name.slice(0, 255), type: clip(type, 120), size, url: safeUrl }];
  });
}

async function nextReference(payload: Payload, offset = 0) {
  const year = new Date().getFullYear();
  const prefix = `TH-ENQ-${year}-`;
  const { totalDocs } = await payload.count({
    collection: "enquiries",
    where: { reference: { like: prefix } },
    overrideAccess: true,
  });
  return `${prefix}${String(totalDocs + 1 + offset).padStart(4, "0")}`;
}

function isDuplicateKey(error: unknown) {
  const text = error instanceof Error ? `${error.message} ${JSON.stringify(error)}` : String(error);
  return /duplicate|E11000|unique/i.test(text);
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<CreateEnquiryResult> {
  const requestHeaders = await headers();
  const ip = clientIp(requestHeaders);

  if (!rateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000)) {
    return { ok: false, error: "Too many enquiries from this connection. Please try again in a few minutes." };
  }

  const fields: EnquiryFields = {
    topic: TOPIC_IDS.has(input.fields?.topic) ? input.fields.topic : "",
    name: clip(input.fields?.name, 120),
    company: clip(input.fields?.company, 160),
    email: clip(input.fields?.email, 254),
    phone: clip(input.fields?.phone, 40),
    message: clip(input.fields?.message, 5000),
  };

  const trap = clip(input.website, 300).toLowerCase();
  const copied =
    trap === fields.email.toLowerCase() || (fields.name.length > 0 && trap === fields.name.toLowerCase());
  if (trap && !copied) {
    return { ok: true, reference: `TH-ENQ-${new Date().getFullYear()}-0000` };
  }

  const fieldErrors = validateEnquiry(fields);
  if (Object.keys(fieldErrors).length > 0 || !fields.topic) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const payload = await payloadClient();
  const files = cleanFiles(input.files);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = await nextReference(payload, attempt);
    try {
      await payload.create({
        collection: "enquiries",
        overrideAccess: true,
        data: {
          reference,
          status: "new",
          topic: fields.topic,
          name: fields.name,
          company: fields.company || undefined,
          email: fields.email,
          phone: fields.phone,
          message: fields.message,
          files,
        },
      });
      return { ok: true, reference };
    } catch (error) {
      if (isDuplicateKey(error) && attempt < 4) continue;
      payload.logger.error({ msg: "Failed to save enquiry", err: error });
      return { ok: false, error: "We couldn’t send your enquiry. Please try again, or email us directly." };
    }
  }

  return { ok: false, error: "We couldn’t send your enquiry. Please try again, or email us directly." };
}
