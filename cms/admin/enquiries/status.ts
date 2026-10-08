export type EnquiryStatus = "new" | "in-progress" | "replied" | "closed" | "spam";

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  "in-progress": "In progress",
  replied: "Replied",
  closed: "Closed",
  spam: "Spam",
};

export function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return typeof value === "string" && value in STATUS_LABELS;
}
