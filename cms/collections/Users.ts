import type { CollectionConfig } from "payload";
import { admins, adminsField, adminsOrSelf, authenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Team member", plural: "Team" },
  auth: {
    tokenExpiration: 60 * 60 * 12,
    maxLoginAttempts: 8,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    group: "Settings",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    description: "People who can sign in to the Thimark CMS.",
  },
  access: {
    read: authenticated,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const existing = await req.payload.find({
          collection: "users",
          limit: 1,
          depth: 0,
          pagination: false,
        });
        if (existing.docs.length === 0) return { ...data, role: "admin" };
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      access: { update: adminsField },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        position: "sidebar",
        description: "Admins manage the team and can delete records. Editors manage content and enquiries.",
      },
    },
  ],
  timestamps: true,
};
