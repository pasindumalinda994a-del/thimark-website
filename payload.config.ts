import path from "node:path";
import { fileURLToPath } from "node:url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Enquiries } from "./cms/collections/Enquiries";
import { Gallery } from "./cms/collections/Gallery";
import { Media } from "./cms/collections/Media";
import { News } from "./cms/collections/News";
import { Users } from "./cms/collections/Users";
import { SERVER_URL } from "./cms/preview";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  serverURL: SERVER_URL,
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  sharp,
  collections: [Enquiries, News, Gallery, Media, Users],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — Thimark CMS",
      description: "Content and enquiries for thimark.com",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/brand/logo-mark.svg" }],
    },
    components: {
      graphics: {
        Logo: "/cms/admin/brand/Logo#Logo",
        Icon: "/cms/admin/brand/Icon#Icon",
      },
      beforeLogin: ["/cms/admin/brand/LoginIntro#LoginIntro"],
      beforeNavLinks: ["/cms/admin/nav/InboxLink#InboxLink"],
      views: {
        dashboard: {
          Component: "/cms/admin/dashboard/Dashboard#Dashboard",
        },
      },
    },
    dateFormat: "d MMM yyyy, HH:mm",
  },
  graphQL: {
    disable: true,
  },
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || "noreply@thimark.com",
        defaultFromName: process.env.EMAIL_FROM_NAME || "Thimark",
      })
    : undefined,
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true;
        const secret = process.env.CRON_SECRET;
        return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
      },
    },
  },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      // Uploads use public access. A private Blob store rejects them.
      token: blobToken,
      clientUploads: true,
      collections: {
        media: { disablePayloadAccessControl: true },
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
