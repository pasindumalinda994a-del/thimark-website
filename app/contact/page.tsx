import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Contact Us — Thimark",
};

export default function ContactPage() {
  return <UnderDevelopmentPage name="Contact Us" />;
}
