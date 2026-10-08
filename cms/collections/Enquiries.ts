import type { CollectionConfig } from "payload";
import { TOPICS } from "../../app/(frontend)/enquire/enquire";
import { admins, authenticated } from "../access";
import { notifyNewEnquiry } from "../hooks/notifyEnquiry";

export const ENQUIRY_STATUSES = [
  { label: "New", value: "new" },
  { label: "In progress", value: "in-progress" },
  { label: "Replied", value: "replied" },
  { label: "Closed", value: "closed" },
  { label: "Spam", value: "spam" },
] as const;

const submitted = { readOnly: true } as const;

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    group: "Inbox",
    useAsTitle: "reference",
    defaultColumns: ["reference", "name", "company", "topic", "status", "createdAt"],
    listSearchableFields: ["reference", "name", "company", "email", "message"],
    description: "Requests sent through the enquiry form at /enquire.",
    pagination: { defaultLimit: 25 },
    hideAPIURL: true,
  },
  defaultSort: "-createdAt",
  access: {
    read: authenticated,
    create: () => false,
    update: authenticated,
    delete: admins,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === "update" && data.status === "replied" && originalDoc?.status !== "replied") {
          return { ...data, repliedAt: new Date().toISOString() };
        }
        return data;
      },
    ],
    afterChange: [notifyNewEnquiry],
  },
  fields: [
    {
      name: "summary",
      type: "ui",
      admin: {
        components: { Field: "/cms/admin/enquiries/EnquirySummary#EnquirySummary" },
      },
    },
    {
      type: "collapsible",
      label: "Submitted details",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "topic",
          type: "select",
          required: true,
          options: TOPICS.map((topic) => ({ label: topic.label, value: topic.id })),
          admin: submitted,
        },
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true, admin: { ...submitted, width: "50%" } },
            { name: "company", type: "text", admin: { ...submitted, width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "email", type: "email", required: true, admin: { ...submitted, width: "50%" } },
            { name: "phone", type: "text", required: true, admin: { ...submitted, width: "50%" } },
          ],
        },
        { name: "message", type: "textarea", required: true, admin: { ...submitted, rows: 6 } },
        {
          name: "files",
          label: "Attachments",
          type: "json",
          defaultValue: [],
          admin: {
            ...submitted,
            components: { Field: "/cms/admin/enquiries/AttachmentsField#AttachmentsField" },
          },
        },
      ],
    },
    {
      name: "internalNotes",
      label: "Team notes",
      type: "textarea",
      admin: {
        rows: 5,
        placeholder: "Quoted 12 Oct, waiting on drawings rev B…",
        description: "Private to the team. Never sent to the customer.",
      },
    },
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: ENQUIRY_STATUSES.map((status) => ({ label: status.label, value: status.value })),
      admin: {
        position: "sidebar",
        components: { Cell: "/cms/admin/enquiries/StatusBadge#StatusCell" },
      },
    },
    {
      name: "actions",
      type: "ui",
      admin: {
        position: "sidebar",
        components: { Field: "/cms/admin/enquiries/EnquiryActions#EnquiryActions" },
      },
    },
    {
      name: "assignedTo",
      label: "Assigned to",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
    {
      name: "repliedAt",
      label: "Replied",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
        condition: (data) => Boolean(data?.repliedAt),
      },
    },
  ],
};
