import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Thimark",
};

export default function PrivacyPolicyPage() {
  return <UnderDevelopmentPage name="Privacy Policy" />;
}
