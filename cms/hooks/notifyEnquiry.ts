import type { CollectionAfterChangeHook } from "payload";
import { acknowledgementEmail, teamNotificationEmail, type EnquiryEmailData } from "../email/enquiry";
import { SERVER_URL } from "../preview";

function recipients() {
  return (process.env.ENQUIRY_NOTIFY_TO || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export const notifyNewEnquiry: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== "create" || req.context?.skipEnquiryEmail) return doc;

  const data = doc as EnquiryEmailData & { id: string };
  const adminUrl = `${SERVER_URL}/admin/collections/enquiries/${data.id}`;
  const team = recipients();

  if (team.length > 0) {
    try {
      const email = teamNotificationEmail(data, adminUrl);
      await req.payload.sendEmail({ to: team, replyTo: data.email, ...email });
    } catch (error) {
      req.payload.logger.error({ msg: `Team notification failed for ${data.reference}`, err: error });
    }
  }

  try {
    await req.payload.sendEmail({ to: data.email, ...acknowledgementEmail(data) });
  } catch (error) {
    req.payload.logger.error({ msg: `Acknowledgement failed for ${data.reference}`, err: error });
  }

  return doc;
};
