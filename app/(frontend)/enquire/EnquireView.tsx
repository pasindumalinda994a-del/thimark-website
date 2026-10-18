"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import Copy from "@/app/(frontend)/components/Copy";
import { FormHeading } from "@/app/(frontend)/components/H3Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { COMPANY } from "@/app/(frontend)/components/site";
import {
  CORE_FORMATS,
  EMPTY_FIELDS,
  MAX_FILE_MB,
  MAX_FILES,
  TOPICS,
  UPLOAD_FORMATS,
  acceptAttr,
  fileExt,
  formatBytes,
  takeFiles,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryFields,
  type TopicId,
} from "@/app/(frontend)/enquire/enquire";
import { submitEnquiry } from "@/app/(frontend)/enquire/submit";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };
const joinFootLeft: PlusArms = { up: true, down: false, left: false, right: true };
const joinFootRight: PlusArms = { up: true, down: false, left: true, right: false };

const FIELD_ORDER = ["topic", "name", "email", "phone", "message"] as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function MobileRails({ edge }: { edge: "start" | "mid" | "end" }) {
  const vertical = edge === "start" ? "contact-v-band-start" : "contact-v-band-join";
  const leftArms = edge === "end" ? joinFootLeft : joinLeftEdge;
  const rightArms = edge === "end" ? joinFootRight : joinRightEdge;

  return (
    <>
      <GridLine axis="v" unstyled tone="page" className={`enquire-rail v-g1-0 ${vertical} md:hidden`} />
      <GridLine axis="v" unstyled tone="page" className={`enquire-rail v-g1-12 ${vertical} md:hidden`} />
      <GridLine
        data-enquire-band-rule
        axis="h"
        unstyled
        tone="page"
        className="enquire-rail h-seg-0-12 at-bottom md:hidden"
      />
      <PlusMark tone="page" arms={leftArms} className="enquire-rail v-g1-0 at-bottom md:hidden" />
      <PlusMark tone="page" arms={rightArms} className="enquire-rail v-g1-12 at-bottom md:hidden" />
    </>
  );
}

/** One phone band: its own rails and foot rule. From md up the wrapper is `contents`, so desktop grid placement is untouched. */
function Band({
  edge = "mid",
  intro = false,
  className = "",
  children,
}: {
  edge?: "start" | "mid" | "end";
  intro?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-enquire-band={intro ? "intro" : ""} className={`relative md:contents ${className}`}>
      <MobileRails edge={edge} />
      {children}
    </div>
  );
}

function ChannelArrow() {
  return (
    <svg aria-hidden className="contact-channel-arrow md:hidden" width={12} height={12} viewBox="0 0 12 12" fill="none">
      <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  );
}

function TopicField({
  value,
  error,
  onChange,
}: {
  value: TopicId | "";
  error?: string;
  onChange: (value: string) => void;
}) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = TOPICS.findIndex((item) => item.id === value);
  const [tabStop, setTabStop] = useState(selected >= 0 ? selected : 0);
  const [cols, setCols] = useState(1);

  useEffect(() => {
    setTabStop(selected >= 0 ? selected : 0);
  }, [selected]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setCols(query.matches ? 2 : 1);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const choose = (id: TopicId) => {
    onChange(id);
  };

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(TOPICS.length - 1, index));
    setTabStop(next);
    optionRefs.current[next]?.focus();
    choose(TOPICS[next].id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(index + 1);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(index - 1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(index + cols);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(index - cols);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      moveTo(TOPICS.length - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(TOPICS[index].id);
    }
  };

  return (
    <div className={`topic-matrix-wrap${value ? " is-filled" : ""}${error ? " is-invalid" : ""}`}>
      <div className="topic-matrix-head">
        <span id="enquire-topic-label" className="topic-matrix-label">
          Topic
        </span>
        {error ? (
          <span id="enquire-topic-error" className="topic-matrix-error index-tag">
            {error}
          </span>
        ) : value ? (
          <span className="topic-matrix-hint index-tag" aria-hidden>
            {pad2(selected + 1)} / {pad2(TOPICS.length)}
          </span>
        ) : (
          <span className="topic-matrix-hint index-tag" id="enquire-topic-hint">
            Select one
          </span>
        )}
      </div>
      <div
        id="enquire-topic"
        role="radiogroup"
        aria-labelledby="enquire-topic-label"
        aria-required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "enquire-topic-error" : !value ? "enquire-topic-hint" : undefined}
        className="topic-matrix"
        tabIndex={-1}
        onFocus={(event) => {
          if (event.target !== event.currentTarget) return;
          optionRefs.current[tabStop]?.focus();
        }}
      >
        {TOPICS.map((item, index) => {
          const isSelected = value === item.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              id={`enquire-topic-${item.id}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === tabStop ? 0 : -1}
              className={`topic-cell${isSelected ? " is-selected" : ""}`}
              onClick={() => choose(item.id)}
              onFocus={() => setTabStop(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="topic-cell-mark" aria-hidden />
              <span className="topic-cell-label">{item.label}</span>
              <span className="topic-cell-index index-tag">{pad2(index + 1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  multiline = false,
  upper = false,
  optional = false,
  autoCapitalize,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  multiline?: boolean;
  upper?: boolean;
  optional?: boolean;
  autoCapitalize?: "none" | "words" | "sentences";
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : "", optional ? hintId : ""].filter(Boolean).join(" ");
  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    autoCapitalize,
    "aria-required": optional ? undefined : true,
    "aria-invalid": error ? true : undefined,
    "aria-labelledby": `${id}-label`,
    "aria-describedby": describedBy || undefined,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    className: `contact-control${upper ? " is-upper" : ""}`,
  };

  return (
    <label className={`contact-field${value ? " is-filled" : ""}${multiline ? " is-message" : ""}`}>
      <span id={`${id}-label`} className="contact-field-label">
        {label}
      </span>
      {error ? (
        <span id={errorId} className="contact-field-error index-tag">
          {error}
        </span>
      ) : null}
      {optional ? (
        <span id={hintId} className="contact-field-hint index-tag" hidden={Boolean(value)}>
          Optional
        </span>
      ) : null}
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} enterKeyHint="next" />
      )}
    </label>
  );
}

export default function EnquireView({
  initialTopic,
  uploadsEnabled,
}: {
  initialTopic: TopicId | null;
  uploadsEnabled: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<EnquiryFields>({
    ...EMPTY_FIELDS,
    topic: initialTopic ?? "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [over, setOver] = useState(false);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const dragDepth = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const copy = gsap.utils.toArray<HTMLElement>("[data-enquire-copy]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-enquire-rule]", root);
      const bands = gsap.utils.toArray<HTMLElement>("[data-enquire-band]", root);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(copy, { autoAlpha: 0, y: 12 });
        gsap.set(rules, { scaleX: 0, yPercent: -50, transformOrigin: "left center" });

        const tl = gsap.timeline();
        tl.to(rules, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
          stagger: 0.04,
        });
        tl.to(
          copy,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
          0.12,
        );
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const ruleOf = (band: HTMLElement) =>
          band.querySelector<HTMLElement>(":scope > [data-enquire-band-rule]");
        // Opacity only, never visibility: fields below the fold must stay reachable by Tab.
        const itemsOf = (band: HTMLElement) =>
          band.dataset.enquireBand === "intro"
            ? gsap.utils.toArray<HTMLElement>("[data-enquire-copy]", band)
            : gsap.utils.toArray<HTMLElement>(":scope > :not(.enquire-rail)", band);

        const reveal = (band: HTMLElement, delay = 0) => {
          const tl = gsap.timeline({ delay });
          const rule = ruleOf(band);
          if (rule) tl.to(rule, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, 0);
          tl.to(
            itemsOf(band),
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
            0.12,
          );
          return tl;
        };

        bands.forEach((band) => {
          const rule = ruleOf(band);
          if (rule) gsap.set(rule, { scaleX: 0, yPercent: -50, transformOrigin: "left center" });
          gsap.set(itemsOf(band), { opacity: 0, y: 10 });
        });

        const [intro, ...rest] = bands;
        if (intro) reveal(intro);
        ScrollTrigger.batch(rest, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            batch.forEach((band, index) => reveal(band as HTMLElement, index * 0.08)),
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    if (!reference) return;
    confirmRef.current?.scrollIntoView({ block: "center" });
  }, [reference]);

  const setField = (key: keyof EnquiryFields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }) as EnquiryFields);
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const ingest = (incoming: FileList | File[]) => {
    const result = takeFiles(files, incoming);
    setFiles(result.files);
    setFileError(result.error);
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, item) => item !== index));
    setFileError("");
  };

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dragDepth.current += 1;
    setOver(true);
  };

  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setOver(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setOver(false);
    if (event.dataTransfer.files.length) ingest(event.dataTransfer.files);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const nextErrors = validateEnquiry(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`#enquire-${firstInvalid}`)?.focus();
      }
      return;
    }

    if (!fields.topic) return;

    setSending(true);
    setSubmitError("");
    try {
      const result = await submitEnquiry(fields, files, {
        uploadsEnabled,
        website: honeypotRef.current?.value,
        onProgress: setProgress,
      });
      if (result.ok) {
        setReference(result.reference);
      } else {
        setSubmitError(result.error);
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    } finally {
      setSending(false);
      setProgress("");
    }
  };

  const reset = () => {
    setFields(EMPTY_FIELDS);
    setFiles([]);
    setFileError("");
    setErrors({});
    setSubmitError("");
    setReference("");
  };

  const status = reference
    ? `Request received. Reference ${reference}.`
    : sending
      ? `${progress || "Sending"} your request.`
      : submitError
        ? submitError
        : Object.keys(errors).length > 0
          ? "Check the highlighted fields."
          : "";

  return (
    <SectionGrid
      ref={sectionRef}
      id="enquire"
      aria-labelledby="enquire-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="contact-sheet flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-work hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-11-12 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-12-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-work hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-11-12 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-12-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-br2-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-6-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-br2-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-10 contact-v-top hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-5 hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-6-8 contact-y-5 hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="contact-h-8-10 contact-y-5 hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="contact-h-10-12 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-10 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 contact-y-5 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-6 hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-mid-12 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-6 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 contact-y-6 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-8 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-8 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-8 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-9 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-9 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-9 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-10 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-10 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-10 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-11 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-11 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-11 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-12 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-12 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-12 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-mid-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid at-bottom hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-mid-12 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootLeft} className="v-g1-0 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-6 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootRight} className="v-g1-12 at-bottom hidden md:block" />

      <Band edge="start" intro>
        <div className="contact-intro">
          <div className="contact-title">
            <p data-enquire-copy className="eyebrow">
              Get in touch
            </p>
            <H1Heading id="enquire-heading">Contact</H1Heading>
          </div>
          <Copy
            data-enquire-copy
            variant="lede" size="fixed"
            weight="normal"
            className="max-w-md"
          >
            Request a quote, or talk to the team.
          </Copy>
        </div>
      </Band>

      <address className="contact-channels not-italic">
        <Band className="contact-strip">
          <div data-enquire-copy className="contact-channel is-quick">
            <p className="index-tag opacity-80">New business</p>
            <a
              href={`${COMPANY.email.href}?subject=${encodeURIComponent("New business")}`}
              className="contact-channel-value is-plain"
            >
              {COMPANY.email.label}
            </a>
            <ChannelArrow />
          </div>
          <div data-enquire-copy className="contact-channel is-quick">
            <p className="index-tag opacity-80">Direct line</p>
            <a href={COMPANY.phone.href} className="contact-channel-value">
              {COMPANY.phone.label}
            </a>
            <ChannelArrow />
          </div>
        </Band>
        <Band>
          <div data-enquire-copy className="contact-channel is-works">
            <p className="index-tag opacity-80">Works</p>
            <p className="contact-channel-value">
              {COMPANY.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div className="contact-works-meta">
              <p className="index-tag opacity-60">{COMPANY.coordinates}</p>
              <a
                href={COMPANY.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-directions index-tag"
              >
                Directions
                <svg aria-hidden width={10} height={10} viewBox="0 0 12 12" fill="none">
                  <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
                </svg>
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </div>
          </div>
        </Band>
      </address>

      <div className="md:contents">
        {reference ? (
          <Band edge="end">
            <div ref={confirmRef} className="contact-form contact-confirm" role="status">
              <p data-enquire-copy className="eyebrow">
                Received
              </p>
              <p className="contact-confirm-ref">{reference}</p>
              <p className="contact-note">We&rsquo;ll review the requirement and reply.</p>
              <BrandButton type="button" onClick={reset} className="contact-submit">
                Send another
              </BrandButton>
            </div>
          </Band>
        ) : (
          <form
            ref={formRef}
            className="contact-form"
            noValidate
            aria-busy={sending || undefined}
            onSubmit={onSubmit}
          >
            <Band>
              <div className="contact-form-title">
                <FormHeading data-enquire-copy>Request a quote</FormHeading>
              </div>
            </Band>

            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
              <input
                ref={honeypotRef}
                type="text"
                tabIndex={-1}
                autoComplete="new-password"
                defaultValue=""
              />
            </div>

            <Band>
              <TopicField value={fields.topic} error={errors.topic} onChange={setField("topic")} />
            </Band>
            <Band>
              <Field
                id="enquire-name"
                label="Name"
                value={fields.name}
                error={errors.name}
                autoComplete="name"
                autoCapitalize="words"
                upper
                onChange={setField("name")}
              />
            </Band>
            <Band>
              <Field
                id="enquire-company"
                label="Company"
                value={fields.company}
                autoComplete="organization"
                autoCapitalize="words"
                upper
                optional
                onChange={setField("company")}
              />
            </Band>
            <Band>
              <Field
                id="enquire-email"
                label="Email"
                type="email"
                inputMode="email"
                value={fields.email}
                error={errors.email}
                autoComplete="email"
                autoCapitalize="none"
                onChange={setField("email")}
              />
            </Band>
            <Band>
              <Field
                id="enquire-phone"
                label="Phone"
                type="tel"
                inputMode="tel"
                value={fields.phone}
                error={errors.phone}
                autoComplete="tel"
                onChange={setField("phone")}
              />
            </Band>
            <Band>
              <Field
                id="enquire-message"
                label="Message"
                value={fields.message}
                error={errors.message}
                autoCapitalize="sentences"
                multiline
                onChange={setField("message")}
              />
            </Band>

            <div
              className={`enquire-drop${over ? " is-over" : ""}${files.length ? " has-files" : ""}`}
              onDragEnter={onDragEnter}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={acceptAttr(UPLOAD_FORMATS)}
                className="contact-file-input"
                tabIndex={-1}
                onChange={(event) => {
                  if (event.target.files?.length) ingest(event.target.files);
                  event.target.value = "";
                }}
              />
              <Band className="enquire-drop-band">
                <div className="enquire-drop-head" data-enquire-copy>
                  <div>
                    <p className="index-tag opacity-60">Drawings</p>
                    <p className="enquire-drop-title">Files</p>
                  </div>
                  <p className="enquire-drop-count index-tag">{pad2(files.length)}</p>
                </div>
                {files.length > 0 ? (
                  <ul className="enquire-file-list">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${file.size}-${index}`} className="enquire-file-row">
                        <span className="enquire-file-index index-tag opacity-60">{pad2(index + 1)}</span>
                        <span className="enquire-file-name">
                          <span className="enquire-file-ext index-tag">{fileExt(file.name) || "FILE"}</span>
                          {file.name}
                        </span>
                        <span className="enquire-file-size index-tag">{formatBytes(file.size)}</span>
                        <button
                          type="button"
                          className="enquire-file-remove"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <button
                  type="button"
                  className="enquire-well"
                  aria-label="Add a drawing or document"
                  onClick={() => fileRef.current?.click()}
                >
                  <svg className="enquire-well-frame" aria-hidden>
                    <rect x="0.5" y="0.5" width="100%" height="100%" />
                  </svg>
                  <PlusMark tone="page" className="enquire-plus enquire-plus-tl" />
                  <PlusMark tone="page" className="enquire-plus enquire-plus-tr" />
                  <PlusMark tone="page" className="enquire-plus enquire-plus-bl" />
                  <PlusMark tone="page" className="enquire-plus enquire-plus-br" />
                  <span className="enquire-well-kicker index-tag">
                    {files.length ? "Add another" : "Optional"}
                  </span>
                  <Copy as="span" variant="lead" className="enquire-well-title">
                    <span className="enquire-copy-fine">
                      {files.length ? "Drop or choose a file" : "Drop drawings here"}
                    </span>
                    <span className="enquire-copy-coarse">
                      {files.length ? "Choose another file" : "Add drawings"}
                    </span>
                  </Copy>
                  <span className="enquire-well-formats index-tag">{CORE_FORMATS.join(" · ")}</span>
                  <span className="enquire-drop-spec index-tag">
                    {MAX_FILES} files · {MAX_FILE_MB} MB each
                  </span>
                </button>
                {fileError ? <p className="enquire-drop-error index-tag">{fileError}</p> : null}
                {submitError ? (
                  <p className="enquire-drop-error index-tag" role="alert">
                    {submitError}
                  </p>
                ) : null}
              </Band>
              <Band edge="end">
                <div className="contact-submit-wrap">
                  <BrandButton type="submit" className="contact-submit" disabled={sending}>
                    {sending ? progress || "Sending" : "Send request"}
                  </BrandButton>
                </div>
              </Band>
            </div>
          </form>
        )}
        <p className="sr-only" role="status">
          {status}
        </p>
      </div>
    </SectionGrid>
  );
}
