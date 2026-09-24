import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Automotive — Thimark",
};

export default function AutomotivePage() {
  return <UnderDevelopmentPage name="Automotive" />;
}
