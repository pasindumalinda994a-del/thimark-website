"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/components/BrandButton";
import FormPanel, { formLines } from "@/app/request-a-quote/components/FormPanel";
import RfqSheet, {
  BODY_TOP,
  SheetNav,
  SheetPanel,
  rowTracks,
} from "@/app/request-a-quote/components/RfqSheet";
import ServiceSelector, {
  SERVICE_LINES,
  SERVICE_ROWS,
} from "@/app/request-a-quote/components/ServiceSelector";
import { joinLines, type Lines } from "@/app/request-a-quote/components/SheetLines";
import SuccessSheet, { SUCCESS_LINES } from "@/app/request-a-quote/components/SuccessSheet";
import TitleBlock, {
  SheetFigure,
  TITLE_BLOCK_ROWS,
  summarise,
  titleBlockLines,
} from "@/app/request-a-quote/components/TitleBlock";
import UploadEngine, { UPLOAD_LINES } from "@/app/request-a-quote/components/UploadEngine";
import { RfqProvider, useUploadQueue, type RfqContextValue } from "@/app/request-a-quote/rfq-context";
import {
  CONTACT_FORM,
  PROJECT_FORMS,
  STEP_LABELS,
  buildRecord,
  fieldDomId,
  makeReference,
  orderedErrorKeys,
  serviceById,
  submitRfq,
  validateStep,
  type Errors,
  type RfqRecord,
  type ServiceId,
  type StepId,
  type Value,
  type Values,
} from "@/app/request-a-quote/rfq-schema";

gsap.registerPlugin(useGSAP);

const DRAFT_KEY = "thimark-rfq-draft";

type Phase = "editing" | "submitting" | "done";

type State = {
  step: StepId;
  furthest: StepId;
  service: ServiceId | null;
  values: Values;
  errors: Errors;
  phase: Phase;
  record: RfqRecord | null;
  failed: boolean;
};

type Action =
  | { type: "select"; service: ServiceId }
  | { type: "go"; step: StepId }
  | { type: "advance" }
  | { type: "set"; key: string; value: Value }
  | { type: "errors"; errors: Errors }
  | { type: "restore"; values: Values; service: ServiceId | null }
  | { type: "submitting" }
  | { type: "done"; record: RfqRecord }
  | { type: "failed" }
  | { type: "reset" };

function initialState(service: ServiceId | null): State {
  const step: StepId = service ? 2 : 1;
  return {
    step,
    furthest: step,
    service,
    values: {},
    errors: {},
    phase: "editing",
    record: null,
    failed: false,
  };
}

function maxStep(a: StepId, b: StepId): StepId {
  return (a > b ? a : b) as StepId;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      return {
        ...state,
        service: action.service,
        step: 2,
        furthest: state.service === action.service ? maxStep(state.furthest, 2) : 2,
        errors: {},
      };
    case "go":
      return { ...state, step: action.step, errors: {}, failed: false };
    case "advance": {
      const next = Math.min(3, state.step + 1) as StepId;
      return { ...state, step: next, furthest: maxStep(state.furthest, next), errors: {} };
    }
    case "set": {
      const errors = state.errors[action.key]
        ? Object.fromEntries(Object.entries(state.errors).filter(([key]) => key !== action.key))
        : state.errors;
      return { ...state, values: { ...state.values, [action.key]: action.value }, errors };
    }
    case "errors":
      return { ...state, errors: action.errors };
    case "restore":
      return {
        ...state,
        values: { ...action.values, ...state.values },
        service: state.service ?? action.service,
      };
    case "submitting":
      return { ...state, phase: "submitting", failed: false };
    case "done":
      return { ...state, phase: "done", record: action.record, furthest: 3 };
    case "failed":
      return { ...state, phase: "editing", failed: true };
    case "reset":
      return initialState(null);
  }
}

function stringValues(raw: unknown): Values {
  if (!raw || typeof raw !== "object") return {};
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

const CONTACT_RIGHT_LINES = titleBlockLines(BODY_TOP);

export default function RfqView({ initialService }: { initialService: ServiceId | null }) {
  const [state, dispatch] = useReducer(reducer, initialService, initialState);
  const { step, furthest, service, values, errors, phase, record, failed } = state;
  const uploads = useUploadQueue();
  const lenis = useLenis();
  const [today] = useState(() => new Date());
  const sheetRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstScreen = useRef(true);

  const def = serviceById(service);
  const done = phase === "done";
  const screenKey = done ? "done" : `${step}-${service ?? "none"}`;

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { values?: unknown; service?: ServiceId | null };
      const restored = stringValues(draft.values);
      if (Object.keys(restored).length) {
        dispatch({ type: "restore", values: restored, service: serviceById(draft.service)?.id ?? null });
      }
    } catch {
      window.sessionStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (done || !Object.keys(values).length) return;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ values, service }));
    } catch {
      /* storage full or unavailable */
    }
  }, [values, service, done]);

  useEffect(() => {
    if (firstScreen.current) {
      firstScreen.current = false;
      return;
    }
    const sheet = sheetRef.current;
    if (sheet && sheet.getBoundingClientRect().top < 0) {
      const offset = window.matchMedia("(max-width: 767px)").matches ? -56 : 0;
      if (lenis) lenis.scrollTo(sheet, { offset, duration: 0.8 });
      else sheet.scrollIntoView();
    }
    document.getElementById("rfq-step-heading")?.focus({ preventScroll: true });
    // Only react to screen changes; lenis identity is incidental.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  const revealed = useRef(false);
  useGSAP(
    () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const scope = revealed.current ? sheet.querySelector("[data-rfq-stage]") ?? sheet : sheet;
      revealed.current = true;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          sheet.querySelectorAll("[data-rfq-rule]"),
          { scaleX: 0, yPercent: -50, transformOrigin: "left center" },
          { scaleX: 1, yPercent: -50, duration: 0.8, ease: "power3.inOut", stagger: 0.02 },
        );
        gsap.fromTo(
          scope.querySelectorAll("[data-rfq-copy]"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.05, delay: 0.1 },
        );
        const stamp = sheet.querySelector("[data-rfq-stamp]");
        if (stamp) {
          gsap.fromTo(
            stamp,
            { autoAlpha: 0, scale: 1.6, rotate: -9 },
            { autoAlpha: 1, scale: 1, rotate: -3, duration: 0.5, ease: "back.out(2)", delay: 0.45 },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: sheetRef, dependencies: [screenKey], revertOnUpdate: true },
  );

  const setValue = useCallback((key: string, value: Value) => {
    dispatch({ type: "set", key, value });
  }, []);

  const context = useMemo<RfqContextValue | null>(
    () =>
      service
        ? {
            service,
            values,
            errors,
            setValue,
            uploads: uploads.items,
            addFiles: uploads.addFiles,
            removeFile: uploads.removeFile,
          }
        : null,
    [service, values, errors, setValue, uploads.items, uploads.addFiles, uploads.removeFile],
  );

  const submit = async (id: ServiceId) => {
    dispatch({ type: "submitting" });
    const now = new Date();
    const next = buildRecord(
      id,
      values,
      uploads.items.map((item) => ({ name: item.name, type: item.ext, size: item.size })),
      makeReference(now),
      now.toISOString(),
    );
    try {
      await submitRfq(
        next,
        uploads.items.map((item) => item.file),
      );
      window.sessionStorage.removeItem(DRAFT_KEY);
      dispatch({ type: "done", record: next });
    } catch {
      dispatch({ type: "failed" });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service || phase !== "editing") return;
    const nextErrors = validateStep(service, step, values);
    dispatch({ type: "errors", errors: nextErrors });
    const invalid = orderedErrorKeys(service, step, nextErrors);
    if (invalid.length) {
      document.getElementById(fieldDomId(invalid[0]))?.focus();
      return;
    }
    if (step < 3) dispatch({ type: "advance" });
    else void submit(service);
  };

  const reset = () => {
    uploads.reset();
    window.sessionStorage.removeItem(DRAFT_KEY);
    dispatch({ type: "reset" });
  };

  const errorCount = Object.keys(errors).length;
  const status = failed
    ? "Sending failed — please try again"
    : errorCount
      ? `${errorCount} field${errorCount === 1 ? "" : "s"} to complete`
      : "";

  const summary = def ? summarise(def, values) : null;
  const summaries = {
    1: { value: def?.short ?? "" },
    2: { value: summary?.subject ?? "" },
    3: { value: summary?.client ?? "" },
  };

  let lines: Lines;
  let screen: ReactNode;
  if (done && record && def) {
    lines = SUCCESS_LINES;
    screen = (
      <SuccessSheet record={record} service={def} values={values} headingRef={headingRef} onReset={reset} />
    );
  } else if (step === 1 || !def) {
    lines = SERVICE_LINES;
    screen = (
      <ServiceSelector
        selected={service}
        onSelect={(id) => dispatch({ type: "select", service: id })}
      />
    );
  } else {
    const form = step === 2 ? PROJECT_FORMS[def.id] : CONTACT_FORM;
    const submitting = phase === "submitting";
    lines = joinLines(formLines(form), step === 2 ? UPLOAD_LINES : CONTACT_RIGHT_LINES);
    screen = (
      <>
        <FormPanel
          form={form}
          heading={step === 2 ? "Project details" : "Contact details"}
          headingRef={headingRef}
          status={status}
          onSubmit={onSubmit}
          meta={
            <>
              <span className="opacity-60">{def.short}</span>
              <button type="button" className="rfq-link" onClick={() => dispatch({ type: "go", step: 1 })}>
                Change
              </button>
            </>
          }
        />
        {step === 2 ? (
          <UploadEngine />
        ) : (
          <SheetPanel side="right" edge="mid" rows={rowTracks([TITLE_BLOCK_ROWS, "fill"])}>
            <TitleBlock
              service={def}
              values={values}
              step={step}
              fileCount={uploads.items.length}
              reference={null}
              issuedAt={today}
            />
            <SheetFigure service={def} />
          </SheetPanel>
        )}
        <SheetNav>
          <BrandButton
            tone="steel"
            type="button"
            className="contact-submit"
            onClick={() => dispatch({ type: "go", step: (step - 1) as StepId })}
          >
            Back
          </BrandButton>
          <BrandButton
            type="submit"
            form="rfq-form"
            className="contact-submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
          >
            {step === 3 ? (submitting ? "Submitting…" : def.submit) : `Continue — ${STEP_LABELS[3]}`}
          </BrandButton>
        </SheetNav>
      </>
    );
  }

  return (
    <RfqSheet
      ref={sheetRef}
      step={step}
      furthest={furthest}
      done={done}
      summaries={summaries}
      onGo={(target) => dispatch({ type: "go", step: target })}
      rows={lines === SERVICE_LINES ? SERVICE_ROWS : undefined}
      lines={lines}
    >
      <div key={screenKey} data-rfq-stage className="contents">
        {context ? <RfqProvider value={context}>{screen}</RfqProvider> : screen}
      </div>
    </RfqSheet>
  );
}
