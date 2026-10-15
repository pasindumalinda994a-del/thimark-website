import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";

export const metadata = pageMetadata({
  title: "Resources & Downloads",
  description:
    "Company profile, capability statement, ISO 9001 certificate and product catalogue downloads from Thimark Technocreations.",
  path: "/resources",
  noindex: true,
});

export default function ResourcesPage() {
  return <UnderDevelopmentPage name="Resources & Downloads" />;
}
