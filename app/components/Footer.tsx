"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/components/BrandButton";
import PlusMark from "@/app/components/PlusMark";
import SectionBreak from "@/app/components/SectionBreak";
import { GridLine } from "@/app/components/SectionGrid";
import { RAQ_LINK } from "@/app/components/nav";
import {
  COMPANY,
  FOOTER_NAV,
  LEGAL_LINKS,
  RESOURCE_LINKS,
  SOCIAL_LINKS,
  type ExternalLink,
} from "@/app/components/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLUMN_RAILS = ["v-g1-3", "v-g1-6", "v-g1-9"] as const;

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function GroupHead({ label, index }: { label: string; index: number }) {
  return (
    <p data-footer-item className="footer-group-head index-tag text-steel">
      <span>{label}</span>
      <span aria-hidden className="text-steel/60">
        [{padIndex(index)}]
      </span>
    </p>
  );
}

function FooterLink({
  href,
  children,
  external = false,
  tag,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tag?: string;
  ariaLabel?: string;
}) {
  const className =
    "footer-link font-heading text-[12px] leading-[1.25] font-medium tracking-[0.04em] uppercase";
  const body = (
    <>
      <span aria-hidden className="footer-link-leader" />
      <span className="footer-link-label">{children}</span>
      {tag ? (
        <span aria-hidden className="footer-link-tag index-tag">
          [{tag}]
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {body}
    </Link>
  );
}

function LinkList({ links }: { links: ExternalLink[] }) {
  return (
    <ul className="footer-list">
      {links.map((link) => (
        <li key={link.id} data-footer-item>
          <FooterLink href={link.href} external={link.external} tag={link.tag}>
            {link.label}
          </FooterLink>
        </li>
      ))}
    </ul>
  );
}

/** Colombo wall clock, rendered client-side to avoid hydration drift. */
function LocalClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: COMPANY.timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="tabular-nums" aria-label="Local time in Sri Lanka">
      {time} LK
    </time>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const columns = gsap.utils.toArray<HTMLElement>(
        "[data-footer-column]",
        el,
      );
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        columns.forEach((column, index) => {
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-footer-item]",
            column,
          );
          gsap.set(items, { autoAlpha: 0, y: 10 });
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.06,
            delay: index * 0.08,
            scrollTrigger: {
              trigger: column,
              start: "top 85%",
              toggleActions: "play none play reverse",
            },
          });
        });
      });

      // The footer stays mounted across routes, so measure this page's layout.
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: root, dependencies: [pathname] },
  );

  const scrollTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      ref={root}
      aria-labelledby="footer-heading"
      className="footer content-plate relative z-10 overflow-x-hidden bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] md:ml-sidebar"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <SectionBreak tone="dark" split="quarters" />

      {/* Band 1 — directory */}
      <div className="footer-directory min-h-rows-5">
        <GridLine axis="v" unstyled tone="dark" className="v-g1-0 footer-rail" />
        <GridLine axis="v" unstyled tone="dark" className="v-g1-12 footer-rail" />
        {COLUMN_RAILS.map((rail) => (
          <GridLine
            key={rail}
            axis="v"
            unstyled
            tone="dark"
            className={`${rail} footer-rail hidden md:block`}
          />
        ))}

        <div className="footer-columns">
          {/* Identity */}
          <div data-footer-column className="footer-column footer-column-identity">
            <p data-footer-item className="eyebrow text-steel">
              {COMPANY.name}
            </p>
            <p
              data-footer-item
              className="footer-statement font-heading text-[clamp(16px,1.25vw,24px)] leading-[1.05] font-medium uppercase text-steel"
            >
              {COMPANY.statement}
            </p>
            <p data-footer-item className="footer-description">
              {COMPANY.description}
            </p>
            <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-0 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-12 at-bottom md:hidden" />
          </div>

          {/* Navigate */}
          <nav
            data-footer-column
            aria-label="Footer navigation"
            className="footer-column"
          >
            <GroupHead label="Navigate" index={0} />
            <ul className="footer-list">
              {FOOTER_NAV.map((link) => (
                <li key={link.id} data-footer-item>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
            <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-0 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-12 at-bottom md:hidden" />
          </nav>

          {/* Resources */}
          <div data-footer-column className="footer-column">
            <GroupHead label="Resources & Downloads" index={1} />
            <LinkList links={RESOURCE_LINKS} />
            <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-0 at-bottom md:hidden" />
            <PlusMark tone="dark" className="v-g1-12 at-bottom md:hidden" />
          </div>

          {/* Connect */}
          <div data-footer-column className="footer-column footer-column-connect">
            <GroupHead label="Connect" index={2} />
            <LinkList links={SOCIAL_LINKS} />
            <div data-footer-item className="footer-raq">
              <BrandButton
                href={RAQ_LINK.href}
                tone="steel"
                aria-label={RAQ_LINK.ariaLabel}
                className="w-full"
              >
                Request a Quote
              </BrandButton>
            </div>
          </div>
        </div>

        <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom md:hidden" />
        <GridLine axis="h" unstyled tone="dark" className="h-seg-0-3 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="dark" className="h-seg-3-6 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="dark" className="h-seg-6-9 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="dark" className="h-seg-9g-12 at-bottom hidden md:block" />
        <PlusMark tone="dark" className="v-g1-0 at-bottom" />
        {COLUMN_RAILS.map((rail) => (
          <PlusMark key={rail} tone="dark" className={`${rail} at-bottom hidden md:block`} />
        ))}
        <PlusMark tone="dark" className="v-g1-12 at-bottom" />
      </div>

      {/* Band 2 — legal strip */}
      <div className="footer-legal min-h-rows-1">
        <GridLine axis="v" unstyled tone="dark" className="v-g1-0 footer-rail" />
        <GridLine axis="v" unstyled tone="dark" className="v-g1-12 footer-rail" />

        <p className="footer-legal-copy index-tag text-steel/70">
          © {year} {COMPANY.name} · All rights reserved
        </p>
        <p className="footer-legal-stamp index-tag text-steel/70">
          <span>{COMPANY.locality}</span>
          <span aria-hidden> · </span>
          <span className="tabular-nums">{COMPANY.coordinates}</span>
          <span aria-hidden> · </span>
          <LocalClock />
        </p>
        <div className="footer-legal-links">
          {LEGAL_LINKS.map((link) => (
            <FooterLink key={link.id} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
          <button
            type="button"
            onClick={scrollTop}
            className="footer-link footer-top font-heading text-[12px] leading-none font-medium tracking-[0.04em] uppercase"
            aria-label="Back to top"
          >
            <span aria-hidden className="footer-link-leader" />
            <span className="footer-link-label">Top</span>
            <span aria-hidden className="footer-top-arrow">↑</span>
          </button>
        </div>

        <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="dark" className="v-g1-0 at-bottom" />
        <PlusMark tone="dark" className="v-g1-12 at-bottom" />
      </div>
    </footer>
  );
}
