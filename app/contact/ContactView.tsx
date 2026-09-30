"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/components/BrandButton";
import MarkDrawing from "@/app/components/MarkDrawing";
import PlusMark, { type PlusArms } from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import { COMPANY } from "@/app/components/site";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };
const joinFootLeft: PlusArms = { up: true, down: false, left: false, right: true };
const joinFootRight: PlusArms = { up: true, down: false, left: true, right: false };

const WORK = [
  { id: "oem", label: "OEM partner" },
  { id: "components", label: "Precision components" },
  { id: "machinery", label: "Industrial machinery" },
] as const;

type WorkId = (typeof WORK)[number]["id"];

type Fields = {
  first: string;
  last: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields | "work", string>>;

const EMPTY: Fields = {
  first: "",
  last: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function validate(fields: Fields, work: WorkId | ""): Errors {
  const errors: Errors = {};
  if (!fields.first.trim()) errors.first = "Required";
  if (!fields.last.trim()) errors.last = "Required";
  if (!fields.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Use a valid email";
  }
  if (!fields.phone.trim()) errors.phone = "Required";
  else if (fields.phone.replace(/\D/g, "").length < 6) errors.phone = "Check the number";
  if (!fields.message.trim()) errors.message = "Required";
  if (!work) errors.work = "Select one";
  return errors;
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

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
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
  multiline?: boolean;
  upper?: boolean;
}) {
  const errorId = `${id}-error`;
  const control = multiline ? (
    <textarea
      id={id}
      name={id}
      value={value}
      rows={4}
      autoComplete={autoComplete}
      aria-invalid={error ? true : undefined}
      aria-labelledby={`${id}-label`}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => onChange(event.target.value)}
      className="contact-control"
    />
  ) : (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      autoComplete={autoComplete}
      aria-invalid={error ? true : undefined}
      aria-labelledby={`${id}-label`}
      aria-describedby={error ? errorId : undefined}
      onChange={(event) => onChange(event.target.value)}
      className={`contact-control${upper ? " is-upper" : ""}`}
    />
  );

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
      {control}
    </label>
  );
}

export default function ContactView() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const workRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [work, setWork] = useState<WorkId | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [drafted, setDrafted] = useState(false);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const copy = gsap.utils.toArray<HTMLElement>("[data-contact-copy]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-contact-rule]", root);
      const drawing = root.querySelector<SVGSVGElement>("svg.contact-mark");
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

        if (drawing) {
          const draws = drawing.querySelectorAll("[data-mark-draw]");
          const labels = drawing.querySelectorAll("[data-mark-label]");
          const hatchEl = drawing.querySelector("[data-mark-hatch]");
          const field = drawing.querySelector("[data-mark-field]");
          const guides = drawing.querySelectorAll("[data-mark-guide]");

          if (field) {
            tl.fromTo(field, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.2);
          }
          if (draws.length) {
            tl.fromTo(
              draws,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.05 },
              0.3,
            );
          }
          if (hatchEl) {
            tl.fromTo(
              hatchEl,
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.out" },
              0.9,
            );
          }
          if (labels.length) {
            tl.fromTo(
              labels,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.4, stagger: 0.06 },
              1.1,
            );
          }
          if (guides.length) {
            gsap.to(guides, {
              strokeDashoffset: -40,
              duration: 12,
              ease: "none",
              repeat: -1,
            });
          }
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const setField = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setDrafted(false);
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const chooseWork = (id: WorkId) => {
    setWork(id);
    setDrafted(false);
    setErrors((current) => {
      if (!current.work) return current;
      const next = { ...current };
      delete next.work;
      return next;
    });
  };

  const onWorkKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = WORK.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = index === last ? 0 : index + 1;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = index === 0 ? last : index - 1;
    }
    if (next === null) return;
    event.preventDefault();
    chooseWork(WORK[next].id);
    workRefs.current[next]?.focus();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields, work);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setDrafted(false);
      const order = ["first", "last", "email", "phone", "message"] as const;
      const fieldId = {
        first: "contact-first",
        last: "contact-last",
        email: "contact-email",
        phone: "contact-phone",
        message: "contact-message",
      };
      const firstInvalid = order.find((key) => nextErrors[key]);
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`#${fieldId[firstInvalid]}`)?.focus();
      } else if (nextErrors.work) {
        workRefs.current[0]?.focus();
      }
      return;
    }

    const workLabel = WORK.find((item) => item.id === work)?.label ?? "";
    const lines = [
      `Name: ${fields.first.trim()} ${fields.last.trim()}`,
      fields.company.trim() ? `Company: ${fields.company.trim()}` : null,
      `Email: ${fields.email.trim()}`,
      `Phone: ${fields.phone.trim()}`,
      `Work: ${workLabel}`,
      "",
      fields.message.trim(),
    ].filter((line): line is string => line !== null);

    const subject = `Enquiry — ${workLabel}`;
    window.location.href = `mailto:${COMPANY.email.label}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setDrafted(true);
  };

  const status = drafted
    ? "Enquiry drafted in your email app."
    : Object.keys(errors).length > 0
      ? "Check the highlighted fields."
      : "";

  return (
    <SectionGrid
      ref={sectionRef}
      id="contact-enquiry"
      aria-labelledby="contact-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="contact-sheet flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-6-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-11-12 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-12-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 contact-v-br2-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-5-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-6-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-8-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-9-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-10-11 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-11-12 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-12-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 contact-v-br2-foot hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 contact-v-body hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-10 contact-v-top hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-2 contact-v-work hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 contact-v-work hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-2 contact-v-name hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-5 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-6-8 contact-y-5 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-8-10 contact-y-5 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-10-12 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-10 contact-y-5 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 contact-y-5 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-0-2 contact-y-6 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-2-4 contact-y-6 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-4-6 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-2 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-4 contact-y-6 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-6 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-0-2 contact-y-8 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-2-4 contact-y-8 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-4-6 contact-y-8 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-2 contact-y-8 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-4 contact-y-8 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-8 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-0-2 contact-y-9 hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="contact-h-2-6 contact-y-9 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-9 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-2 contact-y-9 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-9 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-10 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-10 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-10 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-11 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-11 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-11 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid contact-y-12 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 contact-y-12 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 contact-y-12 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 at-br-2 hidden md:block" />

      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-0-mid at-bottom hidden md:block" />
      <GridLine data-contact-rule axis="h" unstyled tone="page" className="h-seg-mid-12 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootLeft} className="v-g1-0 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-6 at-bottom hidden md:block" />
      <PlusMark tone="page" arms={joinFootRight} className="v-g1-12 at-bottom hidden md:block" />

      <div className="relative md:contents">
        <MobileRails edge="start" />
        <div className="contact-intro">
        <div className="contact-title">
          <p data-contact-copy className="eyebrow">
            Enquiry
          </p>
          <h1
            id="contact-heading"
            data-contact-copy
            className="font-heading text-[clamp(40px,5.2vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
          >
            Get in touch
          </h1>
        </div>
        <p
          data-contact-copy
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
        <div data-contact-copy className="contact-channel">
          <p className="index-tag opacity-80">New business</p>
          <a
            href={`${COMPANY.email.href}?subject=${encodeURIComponent("New business")}`}
            className="contact-channel-value is-plain"
          >
            {COMPANY.email.label}
          </a>
        </div>
        <div data-contact-copy className="contact-channel">
          <p className="index-tag opacity-80">Direct line</p>
          <a href={COMPANY.phone.href} className="contact-channel-value">
            {COMPANY.phone.label}
          </a>
        </div>
        <div data-contact-copy className="contact-channel">
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
        <MobileRails edge="mid" />
        <form ref={formRef} className="contact-form" noValidate onSubmit={onSubmit}>
        <div className="contact-form-title">
          <p
            data-contact-copy
            className="font-heading text-[clamp(18px,1.6vw,24px)] leading-none font-medium uppercase"
          >
            Please fill out this form
          </p>
        </div>

        <div className="contact-work-wrap">
          <div
            role="radiogroup"
            aria-label="Kind of work"
            aria-invalid={errors.work ? true : undefined}
            className="contact-work"
          >
            {WORK.map((item, index) => {
              const selected = work === item.id;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    workRefs.current[index] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected || (work === "" && index === 0) ? 0 : -1}
                  className={`contact-work-cell${selected ? " is-selected" : ""}`}
                  onClick={() => chooseWork(item.id)}
                  onKeyDown={(event) => onWorkKey(event, index)}
                >
                  <span className="index-tag opacity-60">{pad2(index + 1)}</span>
                  <span className="contact-work-label">{item.label}</span>
                </button>
              );
            })}
          </div>
          {errors.work ? (
            <span className="contact-work-error index-tag">{errors.work}</span>
          ) : null}
        </div>

        <div className="contact-names">
          <Field
            id="contact-first"
            label="First name"
            value={fields.first}
            error={errors.first}
            autoComplete="given-name"
            upper
            onChange={setField("first")}
          />
          <Field
            id="contact-last"
            label="Last name"
            value={fields.last}
            error={errors.last}
            autoComplete="family-name"
            upper
            onChange={setField("last")}
          />
        </div>
        <Field
          id="contact-company"
          label="Company"
          value={fields.company}
          autoComplete="organization"
          upper
          onChange={setField("company")}
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          value={fields.email}
          error={errors.email}
          autoComplete="email"
          onChange={setField("email")}
        />
        <Field
          id="contact-phone"
          label="Phone number"
          type="tel"
          value={fields.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={setField("phone")}
        />
        <Field
          id="contact-message"
          label="Message"
          value={fields.message}
          error={errors.message}
          multiline
          onChange={setField("message")}
        />

        <BrandButton type="submit" className="contact-submit">
          {drafted ? "Enquiry drafted" : "Submit"}
        </BrandButton>
        </form>
        <p className="sr-only" role="status">
          {status}
        </p>
      </div>

      <div className="relative md:contents">
        <div className="contact-drawing">
          <MobileRails edge="end" />
          <MarkDrawing className="contact-mark" />
        </div>
      </div>
    </SectionGrid>
  );
}
