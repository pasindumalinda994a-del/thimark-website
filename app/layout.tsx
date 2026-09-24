import type { Metadata } from "next";
import { Onest, Space_Grotesk } from "next/font/google";
import CustomCursor from "@/app/components/CustomCursor";
import Footer from "@/app/components/Footer";
import QuoteSection from "@/app/components/QuoteSection";
import PageTransition from "@/app/components/PageTransition";
import SectionBreak from "@/app/components/SectionBreak";
import Sidebar from "@/app/components/Sidebar";
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
        <div className="content-plate relative z-10 bg-steel md:ml-sidebar [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" split="8" />
          <QuoteSection />
        </div>
        <Footer />
      </body>
    </html>
  );
}
