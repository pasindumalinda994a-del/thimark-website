import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Thimark Technocreations collects, uses and protects personal information.",
  path: "/privacy-policy",
  noindex: true,
});

export default function PrivacyPolicyPage() {
  return <UnderDevelopmentPage name="Privacy Policy" />;
}
