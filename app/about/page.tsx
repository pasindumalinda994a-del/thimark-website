import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "About Us — Thimark",
};

export default function AboutPage() {
  return <UnderDevelopmentPage name="About Us" />;
}
