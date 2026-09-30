import type { GlyphKind } from "@/app/components/CapabilityGlyph";

export type ServiceId = "automotive" | "industrial" | "powder-coating" | "general";
export type StepId = 1 | 2 | 3;
export type Value = string;
export type Values = Record<string, Value>;
export type Errors = Record<string, string>;

export type Option = { id: string; label: string; unsure?: boolean };

type FieldBase = {
  key: string;
  label: string;
  required?: boolean;
  /** Required only for these services; otherwise optional. */
  requiredFor?: ServiceId[];
};

export type TextFieldDef = FieldBase & {
  kind: "text" | "email" | "tel" | "date";
  suffix?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "decimal" | "tel" | "email" | "text";
  upper?: boolean;
};

export type AreaFieldDef = FieldBase & {
  kind: "textarea";
  placeholder?: string;
};

export type ChoiceFieldDef = FieldBase & {
  kind: "choice";
  options: Option[];
};

export type ConsentFieldDef = FieldBase & {
  kind: "consent";
  statement: string;
};

export type FieldDef = TextFieldDef | AreaFieldDef | ChoiceFieldDef | ConsentFieldDef;

/**
 * One grid row of the form. `span` is the height in grid rows; `split` places the
 * column break of a two-field row on the half (col 3) or the third (col 2).
 */
export type RowDef = {
  fields: [FieldDef] | [FieldDef, FieldDef];
  span?: 1 | 2;
  split?: "half" | "third";
};

export type SheetForm = {
  rows: RowDef[];
  message: AreaFieldDef;
  consent?: ConsentFieldDef;
};

export type ServiceDef = {
  id: ServiceId;
  index: string;
  short: string;
  label: string;
  title: string;
  cta: string;
  submit: string;
  intent: string;
  glyph: GlyphKind;
  figure: string;
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const SERVICES: readonly ServiceDef[] = [
  {
    id: "automotive",
    index: "01",
    short: "Automotive",
    label: "Automotive Component Manufacturing",
    title: "Automotive Components",
    cta: "Request Automotive Quote",
    submit: "Submit Automotive RFQ",
    intent: "Request for Quotation",
    glyph: "oem",
    figure: "OEM component",
  },
  {
    id: "industrial",
    index: "02",
    short: "Industrial",
    label: "Industrial Machinery & Engineering",
    title: "Industrial Machinery",
    cta: "Discuss Your Project",
    submit: "Submit Industrial RFQ",
    intent: "Request for Quotation",
    glyph: "machinery",
    figure: "Machine assembly",
  },
  {
    id: "powder-coating",
    index: "03",
    short: "Powder Coating",
    label: "Powder Coating",
    title: "Powder Coating",
    cta: "Get a Coating Quote",
    submit: "Submit Powder Coating Inquiry",
    intent: "Powder Coating Inquiry",
    glyph: "coating",
    figure: "Coating line",
  },
  {
    id: "general",
    index: "04",
    short: "General",
    label: "General Engineering Inquiry",
    title: "Not Sure What You Need?",
    cta: "Talk to an Engineer",
    submit: "Submit Engineering Inquiry",
    intent: "Engineering Inquiry",
    glyph: "inquiry",
    figure: "Open requirement",
  },
];

export function serviceById(id: ServiceId | null | undefined) {
  return SERVICES.find((service) => service.id === id) ?? null;
}

export function parseService(raw: string | undefined | null): ServiceId | null {
  if (!raw) return null;
  const aliases: Record<string, ServiceId> = {
    automotive: "automotive",
    industrial: "industrial",
    machinery: "industrial",
    "powder-coating": "powder-coating",
    powder: "powder-coating",
    coating: "powder-coating",
    general: "general",
    inquiry: "general",
  };
  return aliases[raw.toLowerCase().trim()] ?? null;
}

/* ------------------------------------------------------------------ */
/* Upload formats                                                      */
/* ------------------------------------------------------------------ */

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

export function acceptAttr(formats: string[]) {
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

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

const NOT_SURE: Option = { id: "not-sure", label: "Not sure", unsure: true };

const quantity: TextFieldDef = {
  key: "quantity",
  kind: "text",
  label: "Quantity",
  suffix: "pcs",
  inputMode: "numeric",
  required: true,
};

const requiredBy: TextFieldDef = { key: "requiredBy", kind: "date", label: "Required by" };

export const PROJECT_FORMS: Record<ServiceId, SheetForm> = {
  automotive: {
    rows: [
      {
        split: "half",
        fields: [
          { key: "manufacturer", kind: "text", label: "Manufacturer", required: true, upper: true },
          { key: "model", kind: "text", label: "Vehicle / model", required: true, upper: true },
        ],
      },
      {
        fields: [{ key: "partName", kind: "text", label: "Part name / drawing no.", upper: true }],
      },
      { split: "half", fields: [quantity, requiredBy] },
    ],
    message: {
      key: "description",
      kind: "textarea",
      label: "Requirement",
      placeholder: "The part, volumes, material or finish — whatever you know. Drawings carry the rest.",
      required: true,
    },
  },
  industrial: {
    rows: [
      {
        split: "half",
        fields: [
          { key: "industry", kind: "text", label: "Industry", required: true, upper: true },
          { key: "machine", kind: "text", label: "Machine / system", upper: true },
        ],
      },
      {
        split: "half",
        fields: [{ key: "site", kind: "text", label: "Where it's used", upper: true }, requiredBy],
      },
      {
        fields: [
          {
            key: "isTender",
            kind: "choice",
            label: "Tender?",
            options: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }, NOT_SURE],
          },
        ],
      },
    ],
    message: {
      key: "description",
      kind: "textarea",
      label: "Problem to solve",
      placeholder:
        "What must the equipment do? e.g. remove debris from a hydropower intake automatically.",
      required: true,
    },
  },
  "powder-coating": {
    rows: [
      {
        span: 2,
        fields: [
          {
            key: "material",
            kind: "choice",
            label: "Material",
            required: true,
            options: [
              { id: "steel", label: "Steel" },
              { id: "aluminium", label: "Aluminium" },
              { id: "other", label: "Other" },
              NOT_SURE,
            ],
          },
        ],
      },
      {
        split: "half",
        fields: [
          { key: "coatingItems", kind: "text", label: "Items to coat", required: true, upper: true },
          quantity,
        ],
      },
    ],
    message: {
      key: "description",
      kind: "textarea",
      label: "Parts & finish",
      placeholder: "Part size, colour / RAL, finish and any pickup or delivery needs.",
      required: true,
    },
  },
  general: {
    rows: [
      {
        split: "half",
        fields: [
          { key: "industry", kind: "text", label: "Industry", upper: true },
          { ...quantity, required: false, suffix: undefined },
        ],
      },
      { fields: [{ ...requiredBy, label: "Target date" }] },
    ],
    message: {
      key: "description",
      kind: "textarea",
      label: "Requirement",
      placeholder: "What are you looking to manufacture, modify or develop?",
      required: true,
    },
  },
};

export const CONTACT_FORM: SheetForm = {
  rows: [
    {
      split: "third",
      fields: [
        {
          key: "fullName",
          kind: "text",
          label: "Name",
          autoComplete: "name",
          required: true,
          upper: true,
        },
        {
          key: "company",
          kind: "text",
          label: "Company",
          autoComplete: "organization",
          required: true,
          upper: true,
        },
      ],
    },
    {
      split: "half",
      fields: [
        {
          key: "email",
          kind: "email",
          label: "Email",
          autoComplete: "email",
          inputMode: "email",
          required: true,
        },
        {
          key: "phone",
          kind: "tel",
          label: "Phone / WhatsApp",
          autoComplete: "tel",
          inputMode: "tel",
          required: true,
        },
      ],
    },
    {
      fields: [
        {
          key: "country",
          kind: "choice",
          label: "Country",
          required: true,
          options: [
            { id: "sri-lanka", label: "Sri Lanka" },
            { id: "kenya", label: "Kenya" },
            { id: "other", label: "Other" },
          ],
        },
      ],
    },
    {
      fields: [
        {
          key: "location",
          kind: "text",
          label: "City / location",
          autoComplete: "address-level2",
          requiredFor: ["powder-coating"],
          upper: true,
        },
      ],
    },
  ],
  message: { key: "additionalInfo", kind: "textarea", label: "Anything else" },
  consent: {
    key: "consent",
    kind: "consent",
    label: "Consent",
    statement: "Thimark may use these details to review the requirement and contact me.",
    required: true,
  },
};

export const STEP_LABELS: Record<StepId, string> = {
  1: "Service",
  2: "Project",
  3: "Contact",
};

export function formFor(service: ServiceId, step: StepId): SheetForm | null {
  if (step === 1) return null;
  return step === 2 ? PROJECT_FORMS[service] : CONTACT_FORM;
}

export function formFields(form: SheetForm): FieldDef[] {
  return [
    ...form.rows.flatMap((row) => row.fields as FieldDef[]),
    form.message,
    ...(form.consent ? [form.consent] : []),
  ];
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export function isRequired(field: FieldDef, service: ServiceId) {
  return Boolean(field.required || field.requiredFor?.includes(service));
}

export function fieldDomId(key: string) {
  return `rfq-${key}`;
}

export function validateStep(service: ServiceId, step: StepId, values: Values): Errors {
  const form = formFor(service, step);
  const errors: Errors = {};
  if (!form) return errors;
  for (const field of formFields(form)) {
    const value = (values[field.key] ?? "").trim();
    if (isRequired(field, service) && !value) {
      errors[field.key] = field.kind === "choice" ? "Select one" : "Required";
      continue;
    }
    if (!value) continue;
    if (field.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.key] = "Use a valid email";
    }
    if (field.kind === "tel" && value.replace(/\D/g, "").length < 6) {
      errors[field.key] = "Check the number";
    }
  }
  return errors;
}

export function orderedErrorKeys(service: ServiceId, step: StepId, errors: Errors) {
  const form = formFor(service, step);
  return form ? formFields(form).map((field) => field.key).filter((key) => errors[key]) : [];
}

export function optionLabel(key: string, value: Value | undefined): string {
  if (!value) return "";
  const forms = [...Object.values(PROJECT_FORMS), CONTACT_FORM];
  const field = forms
    .flatMap(formFields)
    .find((candidate): candidate is ChoiceFieldDef => candidate.key === key && candidate.kind === "choice");
  return field?.options.find((option) => option.id === value)?.label ?? value;
}

/* ------------------------------------------------------------------ */
/* Record + submission                                                 */
/* ------------------------------------------------------------------ */

export type FileMeta = { name: string; type: string; size: number };

export type RfqRecord = {
  reference: string;
  submittedAt: string;
  service: ServiceId;
  serviceLabel: string;
  intent: string;
  contact: {
    fullName: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    location: string;
    additionalInfo: string;
    consent: boolean;
  };
  project: Record<string, string>;
  files: FileMeta[];
  sendFilesLater: boolean;
  confidential: boolean;
};

export function makeReference(date = new Date()) {
  const digits = new Uint16Array(1);
  crypto.getRandomValues(digits);
  return `TH-RFQ-${date.getFullYear()}-${1000 + (digits[0] % 9000)}`;
}

export function buildRecord(
  service: ServiceId,
  values: Values,
  files: FileMeta[],
  reference: string,
  submittedAt: string,
): RfqRecord {
  const def = serviceById(service)!;
  const text = (key: string) => (values[key] ?? "").trim();

  const project: Record<string, string> = {};
  for (const field of formFields(PROJECT_FORMS[service])) {
    const value = field.kind === "choice" ? optionLabel(field.key, values[field.key]) : text(field.key);
    if (value) project[field.key] = value;
  }

  return {
    reference,
    submittedAt,
    service,
    serviceLabel: def.label,
    intent: def.intent,
    contact: {
      fullName: text("fullName"),
      company: text("company"),
      email: text("email"),
      phone: text("phone"),
      country: optionLabel("country", values.country),
      location: text("location"),
      additionalInfo: text("additionalInfo"),
      consent: values.consent === "yes",
    },
    project,
    files,
    sendFilesLater: values.sendFilesLater === "yes",
    confidential: values.confidential === "yes",
  };
}

/** Single integration point for a backend: swap the body for a POST to a Route Handler. */
export async function submitRfq(record: RfqRecord, files: File[]): Promise<{ reference: string }> {
  void files;
  await new Promise((resolve) => setTimeout(resolve, 1100));
  return { reference: record.reference };
}
