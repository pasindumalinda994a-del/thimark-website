"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/components/BrandButton";
import HomeProgress, { useHomeSection } from "@/app/components/HomeProgress";
import PlusMark from "@/app/components/PlusMark";
import { GridLine } from "@/app/components/SectionGrid";
import {
  HOME_SECTIONS,
  NAV_ITEMS,
  PATH_ACTIVE_IDS,
  RAQ_LINK,
  normalizePath,
  pathLabel,
  type NavItem,
  type NavLink,
} from "@/app/components/nav";

gsap.registerPlugin(useGSAP);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function StationPlus({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width={7}
      height={7}
      viewBox="0 0 7 7"
      fill="none"
      className={`size-[7px] shrink-0 ${className}`}
    >
      <line
        x1="0"
        y1="3.5"
        x2="7"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <line
        x1="3.5"
        y1="0"
        x2="3.5"
        y2="7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Station mark: plus at rest, filled brand square when current. */
function StationMark({ active }: { active: boolean }) {
  return (
    <span className="sb-mark" aria-hidden>
      <StationPlus className="sb-mark-plus" />
      <span className={`sb-mark-square ${active ? "is-on" : ""}`} />
    </span>
  );
}

/** Horizontal rule spanning the plate between the two rails, with pluses. */
function PlateRule({
  edge,
  branch = false,
}: {
  edge: "top" | "bottom";
  branch?: boolean;
}) {
  const at = edge === "top" ? "top-0" : "at-bottom";
  return (
    <>
      <GridLine
        axis="h"
        unstyled
        tone="dark"
        data-sb-rule
        className={`${branch ? "sb-h-seg-branch" : "sb-h-seg"} ${at}`}
      />
      <PlusMark tone="dark" className={`sb-rail-l ${at}`} />
      <PlusMark tone="dark" className={`sb-rail-r ${at}`} />
    </>
  );
}

/** Dashed vertical rails inset from both edges, stopping short of the rules. */
function PlateRails() {
  return (
    <>
      <GridLine axis="v" unstyled tone="dark" className="sb-rail-l sb-rail" />
      <GridLine axis="v" unstyled tone="dark" className="sb-rail-r sb-rail" />
    </>
  );
}

function BrandLogo({
  className = "",
  imageClassName = "h-6",
  priority = false,
}: {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`relative z-10 flex h-full items-center ${className}`}
      aria-label="Thimark home"
    >
      <Image
        src="/brand/logo-wordmark.png"
        alt="Thimark"
        width={231}
        height={41}
        className={`w-auto ${imageClassName}`}
        priority={priority}
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation rows                                                     */
/* ------------------------------------------------------------------ */

function NavRow({
  item,
  index,
  active,
  child = false,
  onNavigate,
}: {
  item: NavLink;
  index?: number;
  active: boolean;
  child?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      data-sb-item
      aria-current={active ? "page" : undefined}
      aria-label={item.fullLabel}
      title={item.fullLabel}
      onClick={onNavigate}
      className={`sb-nav-row ${child ? "sb-nav-row-child" : ""} ${
        active ? "is-active" : ""
      }`}
    >
      <StationMark active={active} />
      <span aria-hidden className="sb-nav-leader" />
      <span className="sb-nav-label font-heading text-[12px] leading-none font-medium tracking-[0.04em] uppercase">
        {item.label}
      </span>
      {index !== undefined ? (
        <span aria-hidden className="sb-nav-index index-tag">
          [{padIndex(index)}]
        </span>
      ) : null}
    </Link>
  );
}

function NavGroup({
  item,
  index,
  activeId,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  activeId: string;
  onNavigate?: () => void;
}) {
  const children = item.children ?? [];
  const groupActive =
    activeId === item.id || children.some((c) => c.id === activeId);

  return (
    <div className="sb-nav-group">
      <p
        data-sb-item
        className={`sb-nav-row sb-nav-row-static ${groupActive ? "is-active" : ""}`}
      >
        <StationMark active={groupActive} />
        <span aria-hidden className="sb-nav-leader" />
        <span className="sb-nav-label font-heading text-[12px] leading-none font-medium tracking-[0.04em] uppercase">
          {item.label}
        </span>
        <span aria-hidden className="sb-nav-index index-tag">
          [{padIndex(index)}]
        </span>
      </p>
      <div className="sb-branch">
        {children.map((child) => (
          <span key={child.id} className="sb-branch-row">
            <GridLine
              axis="h"
              unstyled
              tone="dark"
              className="sb-branch-join"
            />
            <NavRow
              item={child}
              active={activeId === child.id}
              child
              onNavigate={onNavigate}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell (shared between desktop aside and mobile overlay)             */
/* ------------------------------------------------------------------ */

function NavShell({
  activeId,
  isHome,
  section,
  pageName,
  pathname,
  onNavigate,
  logoPriority = false,
  className = "",
}: {
  activeId: string;
  isHome: boolean;
  section: number;
  pageName: string;
  pathname: string;
  onNavigate?: () => void;
  logoPriority?: boolean;
  className?: string;
}) {
  const linkCount = NAV_ITEMS.reduce(
    (n, item) => n + (item.href ? 1 : 0) + (item.children?.length ?? 0),
    0,
  );

  return (
    <div className={`sidebar-plate ${className}`}>
      {/* Logo block */}
      <div className="sb-block sb-block-logo hidden h-rows-2 md:flex">
        <PlateRails />
        <BrandLogo className="sb-logo" priority={logoPriority} />
        <PlateRule edge="bottom" />
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="sb-block sb-block-nav">
        <PlateRails />
        <div data-sb-item className="sb-nav-head">
          <span className="sidebar-group font-heading leading-none font-medium text-steel uppercase">
            Nav
          </span>
          <span className="index-tag text-steel/60" aria-hidden>
            [{padIndex(linkCount - 1)}]
          </span>
        </div>
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item, index) =>
            item.children ? (
              <NavGroup
                key={item.id}
                item={item}
                index={index}
                activeId={activeId}
                onNavigate={onNavigate}
              />
            ) : item.href ? (
              <NavRow
                key={item.id}
                item={{ id: item.id, label: item.label, href: item.href }}
                index={index}
                active={activeId === item.id}
                onNavigate={onNavigate}
              />
            ) : null,
          )}
        </div>
        <PlateRule edge="bottom" />
      </nav>

      {/* Homepage progress rail / page readout */}
      <div className="sb-block sb-block-progress h-rows-3">
        <PlateRails />
        {isHome ? (
          <HomeProgress active={section} onNavigate={onNavigate} />
        ) : (
          <div className="sb-progress" data-sb-item>
            <div className="sb-progress-head">
              <span className="sidebar-group font-heading leading-none font-medium text-steel uppercase">
                Page
              </span>
              <span className="index-tag text-steel/60 normal-case">
                {pathname}
              </span>
            </div>
            <div className="sb-page-readout">
              <StationPlus />
              <span aria-hidden className="hero-reel-leader" />
              <span className="font-heading text-[12px] leading-none font-medium tracking-[0.04em] text-steel uppercase">
                {pageName}
              </span>
            </div>
          </div>
        )}
        <PlateRule edge="bottom" />
      </div>

      {/* Request a quote */}
      <div className="sb-block sb-block-raq" data-sb-item>
        <BrandButton
          href={RAQ_LINK.href}
          aria-label={RAQ_LINK.ariaLabel}
          onClick={onNavigate}
          className="w-full"
        >
          Request a Quote
        </BrandButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

export default function Sidebar() {
  const pathname = normalizePath(usePathname() ?? "/");
  const isHome = pathname === "/";
  const section = useHomeSection(isHome);
  const activeId = isHome
    ? (HOME_SECTIONS[section]?.navId ?? "")
    : (PATH_ACTIVE_IDS[pathname] ?? "");
  const pageName = pathLabel(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);
  const aside = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menuPlus = useRef<SVGSVGElement>(null);
  const overlayFirst = useRef(true);
  const isHomeRef = useRef(isHome);
  const lenis = useLenis();

  // Close the overlay on route change.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  // Desktop entrance: rules draw from the left, rows settle in.
  useGSAP(
    () => {
      const root = aside.current;
      if (!root) return;

      const rules = gsap.utils.toArray<HTMLElement>("[data-sb-rule]", root);
      const items = gsap.utils.toArray<HTMLElement>("[data-sb-item]", root);
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => {
          gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(items, { autoAlpha: 0, y: 8 });

          const tl = gsap.timeline({ paused: true });
          tl.to(rules, {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.inOut",
            stagger: 0.06,
          });
          tl.to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.05,
            },
            0.2,
          );

          // The preloader only runs on the homepage; elsewhere play at once.
          if (
            !isHomeRef.current ||
            document.documentElement.dataset.preloaded === "true"
          ) {
            tl.play();
            return () => tl.kill();
          }

          const onReady = () => tl.play();
          window.addEventListener("thimark:preload-done", onReady);
          return () => {
            window.removeEventListener("thimark:preload-done", onReady);
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: aside },
  );

  // Mobile overlay fade + plus rotation.
  useGSAP(
    () => {
      const el = overlay.current;
      const plus = menuPlus.current;
      if (!el) return;

      if (overlayFirst.current) {
        overlayFirst.current = false;
        gsap.set(el, { autoAlpha: 0 });
        if (plus) gsap.set(plus, { rotation: 0 });
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: menuOpen ? 1 : 0 });
        if (plus) gsap.set(plus, { rotation: menuOpen ? 45 : 0 });
        return;
      }

      gsap.to(el, {
        autoAlpha: menuOpen ? 1 : 0,
        duration: menuOpen ? 0.32 : 0.24,
        ease: "power2.out",
      });
      if (plus) {
        gsap.to(plus, {
          rotation: menuOpen ? 45 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [menuOpen] },
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <aside
        ref={aside}
        className="fixed inset-y-0 left-0 z-30 hidden w-sidebar md:block"
      >
        <NavShell
          activeId={activeId}
          isHome={isHome}
          section={section}
          pageName={pageName}
          pathname={pathname}
          logoPriority
        />
      </aside>

      <header className="content-plate fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-cream md:hidden">
        <BrandLogo className="px-4" imageClassName="h-7" priority />
        <button
          type="button"
          className="relative z-10 mr-2 flex size-10 items-center justify-center text-steel"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <svg
            ref={menuPlus}
            aria-hidden
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
          >
            <line
              x1="0"
              y1="7"
              x2="14"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <line
              x1="7"
              y1="0"
              x2="7"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
        <GridLine axis="h" unstyled tone="dark" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="dark" className="v-g1-0 at-bottom" />
        <PlusMark tone="dark" className="v-g1-12 at-bottom" />
      </header>

      <div
        ref={overlay}
        id="mobile-nav"
        className={`fixed inset-0 z-30 flex flex-col bg-cream pt-14 opacity-0 md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <NavShell
          activeId={activeId}
          isHome={isHome}
          section={section}
          pageName={pageName}
          pathname={pathname}
          onNavigate={closeMenu}
          className="min-h-0 flex-1 overflow-y-auto"
        />
      </div>
    </>
  );
}
