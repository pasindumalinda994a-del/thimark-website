import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Resources & Downloads — Thimark",
};

export default function ResourcesPage() {
  return <UnderDevelopmentPage name="Resources & Downloads" />;
}
