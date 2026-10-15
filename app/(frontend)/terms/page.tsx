import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Thimark Technocreations website.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return <UnderDevelopmentPage name="Terms & Conditions" />;
}
