export const TOPICS = [
  { id: "automotive", label: "Automotive" },
  { id: "industrial", label: "Industrial machinery" },
  { id: "powder-coating", label: "Powder coating" },
  { id: "general", label: "General" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

const TOPIC_ALIASES: Record<string, TopicId> = {
  automotive: "automotive",
  industrial: "industrial",
  machinery: "industrial",
  "powder-coating": "powder-coating",
  powder: "powder-coating",
  coating: "powder-coating",
  general: "general",
  inquiry: "general",
};

export function parseTopic(raw: string | undefined | null): TopicId | null {
  if (!raw) return null;
  return TOPIC_ALIASES[raw.toLowerCase().trim()] ?? null;
}

export function topicLabel(id: TopicId | "") {
  return TOPICS.find((topic) => topic.id === id)?.label ?? "";
}

export const CORE_FORMATS = ["DWG", "STEP", "PDF"] as const;

export const UPLOAD_FORMATS = [
  "DWG",
  "STEP",
  "PDF",
  "STP",
  "DXF",
  "IGES",
  "IGS",
  "XLS",
  "XLSX",
  "DOC",
  "DOCX",
  "JPG",
  "JPEG",
  "PNG",
];

export const MAX_FILE_MB = 50;
export const MAX_FILES = 20;

const FORMAT_SET = new Set(UPLOAD_FORMATS);

export function acceptAttr(formats: readonly string[]) {
  return formats.map((ext) => `.${ext.toLowerCase()}`).join(",");
}

export function fileExt(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > -1 ? name.slice(dot + 1).toUpperCase() : "";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function takeFiles(current: File[], incoming: Iterable<File>) {
  const files = [...current];
  let error = "";

  for (const file of incoming) {
    const ext = fileExt(file.name);
    if (!FORMAT_SET.has(ext)) {
      error ||= `${file.name} isn’t a supported file`;
      continue;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      error ||= `${file.name} is over ${MAX_FILE_MB} MB`;
      continue;
    }
    if (files.length >= MAX_FILES) {
      error ||= `Up to ${MAX_FILES} files`;
      break;
    }
    if (files.some((kept) => kept.name === file.name && kept.size === file.size)) continue;
    files.push(file);
  }

  return { files, error };
}

export type EnquiryFields = {
  topic: TopicId | "";
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

export const EMPTY_FIELDS: EnquiryFields = {
  topic: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

export function validateEnquiry(fields: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!fields.topic) errors.topic = "Select one";
  if (!fields.name.trim()) errors.name = "Required";
  if (!fields.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Use a valid email";
  }
  if (!fields.phone.trim()) errors.phone = "Required";
  else if (fields.phone.replace(/\D/g, "").length < 6) errors.phone = "Check the number";
  if (!fields.message.trim()) errors.message = "Required";
  return errors;
}

export type FileMeta = { name: string; type: string; size: number };
