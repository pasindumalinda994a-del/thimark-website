import type { Metadata } from "next";
import ContactView from "@/app/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact Us — Thimark",
  description:
    "Tell Thimark the requirement. New business, a direct line, and the Kadawatha works — then send the enquiry.",
};

export default function ContactPage() {
  return (
    <main className="contact content-plate relative z-10 bg-cream pt-14 text-steel md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <ContactView />
    </main>
  );
}
