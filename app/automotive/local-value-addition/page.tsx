import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Local Value Addition — Thimark",
};

export default function LocalValueAdditionPage() {
  return <UnderDevelopmentPage name="Local Value Addition" />;
}
