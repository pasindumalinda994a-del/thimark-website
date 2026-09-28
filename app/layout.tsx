import type { Metadata } from "next";
import { Onest, Space_Grotesk } from "next/font/google";
import CustomCursor from "@/app/components/CustomCursor";
import PageTransition from "@/app/components/PageTransition";
import Sidebar from "@/app/components/Sidebar";
import SiteClose from "@/app/components/SiteClose";
import SmoothScroll from "@/app/components/SmoothScroll";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Thimark — We Engineer What Moves Industry Forward",
  description:
    "From precision automotive components to purpose-built industrial machinery, Thimark turns engineering challenges into dependable solutions — designed, manufactured, and built in Sri Lanka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${onest.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll />
        <Sidebar />
        <PageTransition />
        <CustomCursor />
        {children}
        <SiteClose />
      </body>
    </html>
  );
}
