"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import HomeProgress, {
  useHomeSection,
  useMidlineNavId,
} from "@/app/(frontend)/components/HomeProgress";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { scrollToHero } from "@/app/(frontend)/components/SmoothScroll";
import {
  NAV_ITEMS,
  PAGE_SECTIONS,
  PATH_ACTIVE_IDS,
  RAQ_LINK,
  divisionSectionTargets,
  hrefPath,
  normalizePath,
  pathLabel,
  pathSection,
  type HomeSection,
  type NavItem,
  type NavLink,
} from "@/app/(frontend)/components/nav";

gsap.registerPlugin(useGSAP);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const OPEN_DELAY = 80;
const CLOSE_DELAY = 140;

function useDivisionPreview() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewIdRef = useRef<string | null>(null);
  const pendingId = useRef<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const preview = (id: string, immediate = false) => {
    window.clearTimeout(closeTimer.current);
    pendingId.current = id;
    if (previewIdRef.current === id) {
      window.clearTimeout(openTimer.current);
      return;
    }
    window.clearTimeout(openTimer.current);
    const apply = () => {
      if (pendingId.current !== id) return;
      previewIdRef.current = id;
      setPreviewId(id);
    };
    if (immediate || prefersReducedMotion()) {
      apply();
      return;
    }
    openTimer.current = setTimeout(apply, OPEN_DELAY);
  };

  const endPreview = (id: string) => {
    if (pendingId.current !== id) return;
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    const delay = prefersReducedMotion() ? 0 : CLOSE_DELAY;
    closeTimer.current = setTimeout(() => {
      if (pendingId.current !== id) return;
      pendingId.current = null;
      previewIdRef.current = null;
      setPreviewId(null);
    }, delay);
  };

  return { previewId, preview, endPreview };
}

function onDivisionLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  lenis: Parameters<typeof scrollToHero>[0],
  onNavigate?: () => void,
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  onNavigate?.();
  if (normalizePath(window.location.pathname) !== hrefPath(href)) return;
  event.preventDefault();
  scrollToHero(lenis);
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Same length and thickness as the leader dash. Mirrors --plus-size and --stroke. */
const MARK = 7;
const WEIGHT = 1.5;

function StationPlus({ className = "" }: { className?: string }) {
  const mid = MARK / 2;
  const inset = WEIGHT / 2;

  return (
    <svg
      aria-hidden
      width={MARK}
      height={MARK}
      viewBox={`0 0 ${MARK} ${MARK}`}
      fill="none"
      className={`size-[7px] shrink-0 ${className}`}
    >
      <line
        x1={inset}
        y1={mid}
        x2={MARK - inset}
        y2={mid}
        stroke="currentColor"
        strokeWidth={WEIGHT}
        strokeLinecap="square"
      />
      <line
        x1={mid}
        y1={inset}
        x2={mid}
        y2={MARK - inset}
        stroke="currentColor"
        strokeWidth={WEIGHT}
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
  closed = false,
}: {
  edge: "top" | "bottom";
  branch?: boolean;
  /** No rail continues below this rule, so the pluses omit the down arm. */
  closed?: boolean;
}) {
  const at = edge === "top" ? "top-0" : "at-bottom";
  const down = !closed;
  return (
    <>
      <GridLine
        axis="h"
        unstyled
        tone="dark"
        data-sb-rule
        className={`${branch ? "sb-h-seg-branch" : "sb-h-seg"} ${at}`}
      />
      <PlusMark
        tone="dark"
        arms={{ up: true, down, left: false, right: true }}
        className={`sb-rail-l ${at}`}
      />
      <PlusMark
        tone="dark"
        arms={{ up: true, down, left: true, right: false }}
        className={`sb-rail-r ${at}`}
      />
    </>
  );
}

/** Dashed vertical rails. Open at the plate top; between pluses everywhere else. */
function PlateRails({ edge }: { edge: "open" | "between" }) {
  const rail = edge === "open" ? "hero-v-above-plus" : "hero-v-between-pluses";
  return (
    <>
      <GridLine axis="v" unstyled tone="dark" className={`sb-rail-l ${rail}`} />
      <GridLine axis="v" unstyled tone="dark" className={`sb-rail-r ${rail}`} />
    </>
  );
}

const BRAND_LOGOS = {
  full: { src: "/brand/logo-full.svg", width: 6987, height: 1812 },
  horizontal: { src: "/brand/logo-horizontal.svg", width: 6987, height: 1248 },
} as const;

function BrandLogo({
  variant = "horizontal",
  className = "",
  imageClassName = "h-6",
  eager = false,
}: {
  variant?: keyof typeof BRAND_LOGOS;
  className?: string;
  imageClassName?: string;
  eager?: boolean;
}) {
  const logo = BRAND_LOGOS[variant];
  return (
    <Link
      href="/"
      className={`relative z-10 flex h-full items-center ${className}`}
      aria-label="Thimark home"
    >
      <Image
        src={logo.src}
        alt="Thimark"
        width={logo.width}
        height={logo.height}
        className={`w-auto ${imageClassName}`}
        loading={eager ? "eager" : undefined}
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
  showIndex = true,
  onNavigate,
}: {
  item: NavLink;
  index?: number;
  active: boolean;
  child?: boolean;
  showIndex?: boolean;
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
      <span className="sb-nav-label font-heading font-medium tracking-[0.04em] uppercase">
        {item.label}
      </span>
      {showIndex && index !== undefined ? (
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
  open,
  showIndex = true,
  onPreview,
  onPreviewEnd,
  onDivisionClick,
  onNavigate,
  idPrefix,
}: {
  item: NavItem;
  index: number;
  activeId: string;
  open: boolean;
  showIndex?: boolean;
  onPreview: (id: string, immediate?: boolean) => void;
  onPreviewEnd: (id: string) => void;
  onDivisionClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  onNavigate?: () => void;
  idPrefix: string;
}) {
  const children = item.children ?? [];
  const pageHref = item.href ?? (children[0] ? hrefPath(children[0].href) : "/");
  const groupActive =
    activeId === item.id || children.some((c) => c.id === activeId);
  const pageCurrent = activeId === item.id;
  const panelId = `${idPrefix}-nav-drawer-${item.id}`;

  return (
    <div
      className={`sb-nav-group ${open ? "is-open" : ""}`}
      onMouseEnter={() => onPreview(item.id)}
      onMouseLeave={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) return;
        if (event.currentTarget.contains(document.activeElement)) return;
        onPreviewEnd(item.id);
      }}
      onFocus={() => onPreview(item.id, true)}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) return;
        if (event.currentTarget.matches(":hover")) return;
        onPreviewEnd(item.id);
      }}
    >
      <Link
        href={pageHref}
        data-sb-item
        className={`sb-nav-row sb-nav-toggle ${pageCurrent ? "is-active" : ""} ${
          groupActive ? "is-group" : ""
        }`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={pageCurrent ? "page" : undefined}
        onClick={(event) => onDivisionClick(event, pageHref)}
      >
        <StationMark active={groupActive} />
        <span aria-hidden className="sb-nav-leader" />
        <span className="sb-nav-label font-heading font-medium tracking-[0.04em] uppercase">
          {item.label}
        </span>
        <svg
          aria-hidden
          width={8}
          height={8}
          viewBox="0 0 8 8"
          fill="none"
          className="sb-nav-chevron"
        >
          <path
            d="M2.25 1.25 5.75 4 2.25 6.75"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
          />
        </svg>
        {showIndex ? (
          <span aria-hidden className="sb-nav-index index-tag">
            [{padIndex(index)}]
          </span>
        ) : null}
      </Link>
      <div
        id={panelId}
        className="sb-drawer"
        role="region"
        aria-label={item.label}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="sb-drawer-clip">
          <div className="sb-branch">
            {children.map((child) => (
              <NavRow
                key={child.id}
                item={child}
                active={activeId === child.id}
                child
                showIndex={showIndex}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell (shared between desktop aside and mobile overlay)             */
/* ------------------------------------------------------------------ */

function NavShell({
  activeId,
  sections,
  section,
  pageName,
  pathname,
  onNavigate,
  eagerLogo = false,
  className = "",
  idPrefix,
  variant = "sidebar",
}: {
  activeId: string;
  sections?: readonly HomeSection[];
  section: number;
  pageName: string;
  pathname: string;
  onNavigate?: () => void;
  eagerLogo?: boolean;
  className?: string;
  idPrefix: string;
  variant?: "sidebar" | "drawer";
}) {
  const isDrawer = variant === "drawer";
  const lenis = useLenis();
  const sectionName = pathSection(pathname);
  const linkCount = NAV_ITEMS.reduce(
    (n, item) =>
      n + (item.children?.length ? item.children.length : item.href ? 1 : 0),
    0,
  );
  const routeGroup =
    NAV_ITEMS.find(
      (item) =>
        Boolean(item.children?.length) &&
        (item.id === activeId ||
          item.children?.some((child) => child.id === activeId)),
    )?.id ?? null;
  const { previewId, preview, endPreview } = useDivisionPreview();
  const openId = previewId ?? routeGroup;

  return (
    <div className={`sidebar-plate${isDrawer ? " sb-drawer-plate" : ""} ${className}`}>
      {isDrawer ? null : (
        <div className="sb-block sb-block-logo h-rows-2">
          <PlateRails edge="open" />
          <div className="sb-logo-lockup">
            <BrandLogo
              variant="full"
              className="sb-logo"
              imageClassName="h-13"
              eager={eagerLogo}
            />
          </div>
          <PlateRule edge="bottom" />
        </div>
      )}

      {/* Navigation */}
      <nav aria-label="Dashboard" className="sb-block sb-block-nav">
        <PlateRails edge={isDrawer ? "open" : "between"} />
        <div data-sb-item className="sb-nav-head">
          <span className="sidebar-group font-heading leading-none font-medium text-steel uppercase">
            Dashboard
          </span>
          {isDrawer ? null : (
            <span className="index-tag text-steel/60" aria-hidden>
              [{padIndex(linkCount - 1)}]
            </span>
          )}
        </div>
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item, index) =>
            item.children ? (
              <NavGroup
                key={item.id}
                item={item}
                index={index}
                activeId={activeId}
                open={openId === item.id}
                showIndex={!isDrawer}
                onPreview={preview}
                onPreviewEnd={endPreview}
                onDivisionClick={(event, href) =>
                  onDivisionLinkClick(event, href, lenis, onNavigate)
                }
                onNavigate={onNavigate}
                idPrefix={idPrefix}
              />
            ) : item.href ? (
              <NavRow
                key={item.id}
                item={{ id: item.id, label: item.label, href: item.href }}
                index={index}
                active={activeId === item.id}
                showIndex={!isDrawer}
                onNavigate={onNavigate}
              />
            ) : null,
          )}
        </div>
        <PlateRule edge="bottom" closed={isDrawer} />
      </nav>

      {/* Section index / page readout */}
      {isDrawer ? null : (
      <div className="sb-block sb-block-progress h-rows-3">
        <PlateRails edge="between" />
        {sections ? (
          <HomeProgress
            sections={sections}
            pathname={pathname}
            active={section}
            onNavigate={onNavigate}
          />
        ) : (
          <div className="sb-panel" data-sb-item>
            <dl className="sb-spec">
              <div className="sb-spec-row">
                <dt className="sb-spec-key sidebar-group font-heading leading-none font-medium uppercase">
                  Section
                </dt>
                <dd className="sb-spec-val">
                  <span className="sb-spec-text font-heading font-medium tracking-[0.04em] uppercase">
                    {sectionName}
                  </span>
                </dd>
              </div>
              <div className="sb-spec-row is-page">
                <dt className="sb-spec-key sidebar-group font-heading leading-none font-medium uppercase">
                  Page
                </dt>
                <dd className="sb-spec-val">
                  <StationPlus />
                  <span aria-hidden className="sb-spec-leader" />
                  <span className="sb-spec-text font-heading font-medium tracking-[0.04em] uppercase">
                    {pageName}
                  </span>
                </dd>
              </div>
              <div className="sb-spec-row">
                <dt className="sb-spec-key sidebar-group font-heading leading-none font-medium uppercase">
                  Path
                </dt>
                <dd className="sb-spec-val">
                  <span className="sb-spec-text index-tag" title={pathname}>
                    {pathname}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        )}
        <PlateRule edge="bottom" closed />
      </div>
      )}

      {/* Enquire */}
      <div className="sb-block sb-block-raq" data-sb-item>
        <BrandButton
          href={RAQ_LINK.href}
          aria-label={RAQ_LINK.ariaLabel}
          onClick={onNavigate}
          className="w-full"
        >
          {RAQ_LINK.label}
        </BrandButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawing sheet                                                */
/* ------------------------------------------------------------------ */

function SheetArrow() {
  return (
    <svg aria-hidden width={28} height={8} viewBox="0 0 28 8" fill="none" className="shrink-0">
      <path d="M0 4h24" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20.5 1 26 4l-5.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function SheetChevron() {
  return (
    <svg aria-hidden width={8} height={8} viewBox="0 0 8 8" fill="none" className="mn-chevron">
      <path
        d="M2.25 1.25 5.75 4 2.25 6.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

function MobileRow({
  item,
  index,
  active,
  onNavigate,
}: {
  item: NavLink;
  index: number;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      data-sb-item
      aria-current={active ? "page" : undefined}
      aria-label={item.fullLabel}
      onClick={onNavigate}
      className={`mn-row ${active ? "is-active" : ""}`}
    >
      <span aria-hidden className="mn-index index-tag">
        {padIndex(index)}
      </span>
      <StationMark active={active} />
      <span className="mn-label font-heading font-medium tracking-[0.04em] uppercase">
        {item.label}
      </span>
    </Link>
  );
}

function MobileGroup({
  item,
  index,
  activeId,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  activeId: string;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const lenis = useLenis();
  const children = item.children ?? [];
  const pageHref = item.href ?? (children[0] ? hrefPath(children[0].href) : "/");
  const groupActive =
    activeId === item.id || children.some((child) => child.id === activeId);
  const pageCurrent = activeId === item.id;
  const panelId = `menu-nav-${item.id}`;

  return (
    <div className={`mn-group ${open ? "is-open" : ""}`}>
      <div data-sb-item className={`mn-split ${groupActive ? "is-active" : ""}`}>
        <Link
          href={pageHref}
          className="mn-row-link"
          aria-current={pageCurrent ? "page" : undefined}
          onClick={(event) => onDivisionLinkClick(event, pageHref, lenis, onNavigate)}
        >
          <span aria-hidden className="mn-index index-tag">
            {padIndex(index)}
          </span>
          <StationMark active={groupActive} />
          <span className="mn-label font-heading font-medium tracking-[0.04em] uppercase">
            {item.label}
          </span>
        </Link>
        <button
          type="button"
          className="mn-expand"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Hide" : "Show"} ${item.label} sections`}
          onClick={onToggle}
        >
          <SheetChevron />
        </button>
      </div>
      <div id={panelId} className="mn-sub" role="region" aria-label={item.label} aria-hidden={!open} inert={!open}>
        <div className="mn-sub-clip">
          <div className="mn-branch">
            {children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                {...(open ? { "data-sb-item": true } : {})}
                aria-current={activeId === child.id ? "page" : undefined}
                aria-label={child.fullLabel}
                onClick={onNavigate}
                className={`mn-row mn-row-child ${activeId === child.id ? "is-active" : ""}`}
              >
                <span aria-hidden className="mn-leader" />
                <span className="mn-label font-heading font-medium tracking-wider uppercase">
                  {child.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSheet({
  activeId,
  pageName,
  pathname,
  onNavigate,
}: {
  activeId: string;
  pageName: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const routeGroup =
    NAV_ITEMS.find(
      (item) =>
        Boolean(item.children?.length) &&
        (item.id === activeId || item.children?.some((child) => child.id === activeId)),
    )?.id ?? null;
  const [openId, setOpenId] = useState<string | null>(routeGroup);

  useEffect(() => {
    setOpenId(routeGroup);
  }, [pathname, routeGroup]);

  return (
    <div className="mn-sheet">
      <div data-sb-item className="mn-head">
        <span className="sidebar-group font-heading leading-none font-medium text-steel uppercase">
          Menu
        </span>
        <span className="mn-head-page index-tag">{pageName}</span>
      </div>
      <nav aria-label="Menu" className="mn-nav">
        {NAV_ITEMS.map((item, index) =>
          item.children ? (
            <MobileGroup
              key={item.id}
              item={item}
              index={index}
              activeId={activeId}
              open={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              onNavigate={onNavigate}
            />
          ) : item.href ? (
            <MobileRow
              key={item.id}
              item={{ id: item.id, label: item.label, href: item.href }}
              index={index}
              active={activeId === item.id}
              onNavigate={onNavigate}
            />
          ) : null,
        )}
      </nav>
      <Link
        href={RAQ_LINK.href}
        data-sb-item
        aria-label={RAQ_LINK.ariaLabel}
        onClick={onNavigate}
        className="mn-enquire"
      >
        <span className="font-heading font-medium tracking-[0.06em] uppercase">{RAQ_LINK.label}</span>
        <SheetArrow />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

export default function Sidebar() {
  const pathname = normalizePath(usePathname() ?? "/");
  const sections = PAGE_SECTIONS[pathname];
  const section = useHomeSection(sections);
  const divisionTargets = useMemo(
    () => divisionSectionTargets(pathname),
    [pathname],
  );
  const divisionNavId = useMidlineNavId(
    divisionTargets,
    !sections && divisionTargets.length > 0,
  );
  const activeId = sections
    ? (sections[section]?.navId ?? PATH_ACTIVE_IDS[pathname] ?? "")
    : (divisionNavId ?? PATH_ACTIVE_IDS[pathname] ?? "");
  const pageName = pathLabel(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);
  const aside = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menuTop = useRef<HTMLSpanElement>(null);
  const menuBottom = useRef<HTMLSpanElement>(null);
  const overlayFirst = useRef(true);
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

  // The sheet draws down from the header. Rows follow, and the bars cross into a close mark.
  useGSAP(
    () => {
      const el = overlay.current;
      const top = menuTop.current;
      const bottom = menuBottom.current;
      if (!el) return;

      const closedClip = "inset(0% 0% 100% 0%)";
      const openClip = "inset(0% 0% 0% 0%)";
      const items = gsap.utils.toArray<HTMLElement>("[data-sb-item]", el);

      const placeBars = (open: boolean, timeline?: gsap.core.Timeline) => {
        const bars = [
          { bar: top, y: open ? 3.25 : 0, rotation: open ? 45 : 0 },
          { bar: bottom, y: open ? -3.25 : 0, rotation: open ? -45 : 0 },
        ];
        for (const { bar, y, rotation } of bars) {
          if (!bar) continue;
          const vars = {
            y,
            rotation,
            transformOrigin: "center center",
            duration: 0.3,
            ease: "power2.out",
          };
          if (timeline) timeline.to(bar, vars, 0);
          else gsap.set(bar, vars);
        }
      };

      if (overlayFirst.current) {
        overlayFirst.current = false;
        gsap.set(el, { autoAlpha: 0, clipPath: closedClip });
        gsap.set(items, { autoAlpha: 0, y: 14 });
        placeBars(false);
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set(el, {
          autoAlpha: menuOpen ? 1 : 0,
          clipPath: menuOpen ? openClip : closedClip,
        });
        gsap.set(items, { autoAlpha: menuOpen ? 1 : 0, y: 0 });
        placeBars(menuOpen);
        return;
      }

      const tl = gsap.timeline();
      if (menuOpen) {
        tl.set(el, { autoAlpha: 1 }, 0);
        tl.fromTo(
          el,
          { clipPath: closedClip },
          { clipPath: openClip, duration: 0.55, ease: "power4.out" },
          0,
        );
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.06,
        );
      } else {
        tl.to(
          items,
          { autoAlpha: 0, duration: 0.18, stagger: 0.02, ease: "power2.in" },
          0,
        );
        tl.fromTo(
          el,
          { clipPath: openClip },
          { clipPath: closedClip, duration: 0.38, ease: "power3.in" },
          0.08,
        );
        tl.set(el, { autoAlpha: 0 });
      }
      placeBars(menuOpen, tl);
    },
    { dependencies: [menuOpen], revertOnUpdate: true },
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <aside
        ref={aside}
        className="fixed inset-y-0 left-0 z-30 hidden w-sidebar xl:block"
      >
        <NavShell
          activeId={activeId}
          sections={sections}
          section={section}
          pageName={pageName}
          pathname={pathname}
          eagerLogo
          idPrefix="desk"
        />
      </aside>

      <header className="content-plate mn-header fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-cream xl:hidden">
        <BrandLogo variant="horizontal" className="px-4" imageClassName="h-7" eager />
        <button
          type="button"
          className="mn-toggle relative z-10 text-steel"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="mn-toggle-label font-heading text-[11px] leading-none font-medium tracking-[0.16em] uppercase">
            Menu
          </span>
          <span className="mn-toggle-rule" aria-hidden>
            <PlusMark
              tone="dark"
              arms={{ up: true, down: false, left: true, right: true }}
              className="mn-toggle-plus"
            />
          </span>
          <span className="mn-toggle-mark">
            <span aria-hidden className="relative block h-2 w-4.5">
              <span
                ref={menuTop}
                className="absolute inset-x-0 top-0 h-[1.5px] bg-current"
              />
              <span
                ref={menuBottom}
                className="absolute inset-x-0 bottom-0 h-[1.5px] bg-current"
              />
            </span>
          </span>
        </button>
        <GridLine axis="h" unstyled tone="dark" className="mn-header-rule-l at-bottom" />
        <GridLine axis="h" unstyled tone="dark" className="mn-header-rule-r at-bottom" />
        <PlusMark
          tone="dark"
          arms={{ up: false, down: false, left: false, right: true }}
          className="v-g1-0 at-bottom"
        />
        <PlusMark
          tone="dark"
          arms={{ up: false, down: false, left: true, right: false }}
          className="v-g1-12 at-bottom"
        />
      </header>

      <div
        ref={overlay}
        id="mobile-nav"
        className={`fixed inset-0 z-30 opacity-0 xl:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mn-scrim" onClick={closeMenu} />
        <div className="mn-frame">
          <div className="mn-plate">
            <MobileSheet
              activeId={activeId}
              pageName={pageName}
              pathname={pathname}
              onNavigate={closeMenu}
            />
          </div>
          <GridLine axis="v" unstyled tone="dark" className="mn-rail mn-rail-l" />
          <GridLine axis="v" unstyled tone="dark" className="mn-rail mn-rail-r" />
          <GridLine axis="h" unstyled tone="dark" className="mn-rule" />
          <PlusMark
            tone="dark"
            arms={{ up: false, down: true, left: false, right: false }}
            className="mn-plus-tl"
          />
          <PlusMark
            tone="dark"
            arms={{ up: false, down: true, left: false, right: false }}
            className="mn-plus-tr"
          />
          <PlusMark
            tone="dark"
            arms={{ up: true, down: false, left: false, right: true }}
            className="mn-plus-bl"
          />
          <PlusMark
            tone="dark"
            arms={{ up: true, down: false, left: true, right: false }}
            className="mn-plus-br"
          />
        </div>
      </div>
    </>
  );
}
