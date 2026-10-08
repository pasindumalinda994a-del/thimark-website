"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent, type KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
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

gsap.registerPlugin(useGSAP);

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
      <GridLine axis="v" unstyled tone="page" className={`v-g1-0 ${vertical} md:hidden`} />
      <GridLine axis="v" unstyled tone="page" className={`v-g1-12 ${vertical} md:hidden`} />
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
      <PlusMark tone="page" arms={leftArms} className="v-g1-0 at-bottom md:hidden" />
      <PlusMark tone="page" arms={rightArms} className="v-g1-12 at-bottom md:hidden" />
    </>
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
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const selected = TOPICS.findIndex((item) => item.id === value);
  const [active, setActive] = useState(selected < 0 ? 0 : selected);

  useEffect(() => {
    if (selected >= 0) setActive(selected);
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (id: TopicId) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const from = open ? active : selected;
      const start = from < 0 ? 0 : from;
      const next =
        event.key === "ArrowDown"
          ? (start + (open ? 1 : 0)) % TOPICS.length
          : (start - (open ? 1 : 0) + TOPICS.length) % TOPICS.length;
      setActive(open ? next : start);
      setOpen(true);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
      setOpen(true);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActive(TOPICS.length - 1);
      setOpen(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setActive(selected < 0 ? 0 : selected);
        setOpen(true);
      } else {
        choose(TOPICS[active].id);
      }
    }
  };

  const mark = value ? pad2(selected + 1) : open ? pad2(active + 1) : "01–04";

  return (
    <div
      ref={rootRef}
      className={`contact-field is-select${value || open ? " is-filled" : ""}${open ? " is-open" : ""}`}
    >
      <span id="enquire-topic-label" className="contact-field-label">
        Topic
      </span>
      {error ? (
        <span id="enquire-topic-error" className="contact-field-error index-tag">
          {error}
        </span>
      ) : null}
      <button
        ref={triggerRef}
        id="enquire-topic"
        type="button"
        className="contact-control is-upper topic-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="enquire-topic-list"
        aria-labelledby="enquire-topic-label"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "enquire-topic-error" : undefined}
        aria-activedescendant={open ? `enquire-topic-${TOPICS[active].id}` : undefined}
        onClick={() => {
          setActive(selected < 0 ? 0 : selected);
          setOpen((current) => !current);
        }}
        onKeyDown={onKeyDown}
      >
        <span className="topic-value">{value ? TOPICS[selected]?.label : ""}</span>
        <span className="topic-index index-tag">{mark}</span>
      </button>
      <ul id="enquire-topic-list" className="topic-menu" role="listbox" aria-labelledby="enquire-topic-label" hidden={!open}>
        {TOPICS.map((item, index) => {
          const isSelected = value === item.id;
          return (
            <li key={item.id} role="presentation">
              <button
                id={`enquire-topic-${item.id}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`topic-option${index === active ? " is-active" : ""}${isSelected ? " is-selected" : ""}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(item.id)}
              >
                <span className="topic-option-index index-tag">{pad2(index + 1)}</span>
                <span className="topic-option-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
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
}) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-labelledby": `${id}-label`,
    "aria-describedby": error ? errorId : undefined,
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
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} />
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
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    ? `Enquiry received. Reference ${reference}.`
    : sending
      ? `${progress || "Sending"} your enquiry.`
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
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-6-7 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-7-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-11-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-6-7 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-7-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-11-br2 hidden md:block" />
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

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-7 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-7 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-7 hidden md:block" />

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

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-mid-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-0-mid at-bottom hidden md:block" />
      <GridLine data-enquire-rule axis="h" unstyled tone="page" className="h-seg-mid-12 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootLeft} className="v-g1-0 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-6 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootRight} className="v-g1-12 at-bottom hidden md:block" />

      <div className="relative md:contents">
        <MobileRails edge="start" />
        <div className="contact-intro">
          <div className="contact-title">
            <p data-enquire-copy className="eyebrow">
              Enquiry
            </p>
            <h1
              id="enquire-heading"
              data-enquire-copy
              className="font-heading text-[clamp(40px,5.2vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
            >
              Enquire
            </h1>
          </div>
          <p
            data-enquire-copy
            className="max-w-md font-heading text-[16px] leading-none font-normal uppercase"
          >
            Tell us the requirement.
            <span className="block">We&rsquo;ll engineer what comes next.</span>
          </p>
        </div>
      </div>

      <div className="relative md:contents">
        <MobileRails edge="mid" />
        <address className="contact-channels not-italic">
          <div data-enquire-copy className="contact-channel">
            <p className="index-tag opacity-80">New business</p>
            <a
              href={`${COMPANY.email.href}?subject=${encodeURIComponent("New business")}`}
              className="contact-channel-value is-plain"
            >
              {COMPANY.email.label}
            </a>
          </div>
          <div data-enquire-copy className="contact-channel">
            <p className="index-tag opacity-80">Direct line</p>
            <a href={COMPANY.phone.href} className="contact-channel-value">
              {COMPANY.phone.label}
            </a>
          </div>
          <div data-enquire-copy className="contact-channel">
            <p className="index-tag opacity-80">Works</p>
            <p className="contact-channel-value">
              {COMPANY.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="index-tag opacity-60">{COMPANY.coordinates}</p>
          </div>
        </address>
      </div>

      <div className="relative md:contents">
        <MobileRails edge="end" />
        {reference ? (
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
        ) : (
          <form
            ref={formRef}
            className="contact-form"
            noValidate
            aria-busy={sending || undefined}
            onSubmit={onSubmit}
          >
            <div className="contact-form-title">
              <p
                data-enquire-copy
                className="font-heading text-[clamp(18px,1.6vw,24px)] leading-none font-medium uppercase"
              >
                Send an enquiry
              </p>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
              <input
                ref={honeypotRef}
                type="text"
                tabIndex={-1}
                autoComplete="new-password"
                defaultValue=""
              />
            </div>

            <TopicField value={fields.topic} error={errors.topic} onChange={setField("topic")} />
            <Field
              id="enquire-name"
              label="Name"
              value={fields.name}
              error={errors.name}
              autoComplete="name"
              upper
              onChange={setField("name")}
            />
            <Field
              id="enquire-company"
              label="Company"
              value={fields.company}
              autoComplete="organization"
              upper
              onChange={setField("company")}
            />
            <Field
              id="enquire-email"
              label="Email"
              type="email"
              inputMode="email"
              value={fields.email}
              error={errors.email}
              autoComplete="email"
              onChange={setField("email")}
            />
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
            <Field
              id="enquire-message"
              label="Message"
              value={fields.message}
              error={errors.message}
              multiline
              onChange={setField("message")}
            />

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
                      <span className="index-tag opacity-60">{pad2(index + 1)}</span>
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
                <span className="enquire-well-title">
                  {files.length ? "Drop or choose a file" : "Drop drawings here"}
                </span>
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
              <div className="contact-submit-wrap">
                <BrandButton type="submit" className="contact-submit" disabled={sending}>
                  {sending ? progress || "Sending" : "Enquire"}
                </BrandButton>
              </div>
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
