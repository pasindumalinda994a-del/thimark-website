"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRfq } from "@/app/request-a-quote/rfq-context";
import {
  fieldDomId,
  isRequired,
  type AreaFieldDef,
  type ChoiceFieldDef,
  type ConsentFieldDef,
  type FieldDef,
  type TextFieldDef,
} from "@/app/request-a-quote/rfq-schema";

export function RequiredMark() {
  return (
    <>
      <span aria-hidden className="rfq-req" />
      <span className="sr-only"> (required)</span>
    </>
  );
}

function useFieldState(field: FieldDef) {
  const { service, values, errors, setValue } = useRfq();
  return {
    id: fieldDomId(field.key),
    value: values[field.key] ?? "",
    error: errors[field.key],
    required: isRequired(field, service),
    setValue,
  };
}

function TextField({ field }: { field: TextFieldDef | AreaFieldDef }) {
  const { id, value, error, required, setValue } = useFieldState(field);
  const errorId = `${id}-error`;
  const area = field.kind === "textarea";
  const shared = {
    id,
    name: field.key,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <label
      className={`contact-field rfq-field${value || field.kind === "date" ? " is-filled" : ""}${
        area ? " is-message" : ""
      }${error ? " is-invalid" : ""}`}
    >
      <span className="contact-field-label">
        {field.label}
        {required ? <RequiredMark /> : null}
      </span>
      {error ? (
        <span id={errorId} className="contact-field-error index-tag">
          {error}
        </span>
      ) : null}
      {area ? (
        <textarea
          {...shared}
          rows={3}
          placeholder={field.placeholder}
          className="contact-control"
          onChange={(event) => setValue(field.key, event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={field.kind}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          className={`contact-control${field.upper ? " is-upper" : ""}`}
          onChange={(event) => setValue(field.key, event.target.value)}
        />
      )}
      {!area && field.suffix ? (
        <span aria-hidden className="rfq-suffix index-tag">
          {field.suffix}
        </span>
      ) : null}
    </label>
  );
}

function ChoiceField({ field }: { field: ChoiceFieldDef }) {
  const { id, value, error, required, setValue } = useFieldState(field);
  const errorId = `${id}-error`;
  const style = { "--rfq-options": field.options.length } as CSSProperties;

  return (
    <fieldset
      className={`rfq-choice${error ? " is-invalid" : ""}`}
      style={style}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="sr-only">
        {field.label}
        {required ? " (required)" : ""}
      </legend>
      <span aria-hidden className="rfq-choice-legend">
        <span className="rfq-choice-label">
          {field.label}
          {required ? <span className="rfq-req" /> : null}
        </span>
      </span>
      {error ? (
        <span id={errorId} className="rfq-choice-error index-tag">
          {error}
        </span>
      ) : null}
      {field.options.map((option, index) => {
        const checked = value === option.id;
        return (
          <label
            key={option.id}
            className={`rfq-choice-cell${checked ? " is-selected" : ""}${option.unsure ? " is-unsure" : ""}`}
          >
            <input
              id={index === 0 ? id : `${id}-${index}`}
              className="sr-only"
              type="radio"
              name={field.key}
              value={option.id}
              checked={checked}
              onChange={() => setValue(field.key, option.id)}
              onClick={() => {
                if (!required && checked) setValue(field.key, "");
              }}
            />
            <span className="index-tag opacity-60">{String(index + 1).padStart(2, "0")}</span>
            <span className="rfq-choice-text">{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function CheckCell({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <label className={`rfq-check-cell${checked ? " is-checked" : ""}${error ? " is-invalid" : ""}`}>
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span aria-hidden className="rfq-check" />
      <span className="rfq-check-copy">{children}</span>
      {error ? (
        <span id={errorId} className="contact-field-error index-tag">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ConsentField({ field }: { field: ConsentFieldDef }) {
  const { id, value, error, setValue } = useFieldState(field);
  return (
    <CheckCell
      id={id}
      checked={value === "yes"}
      error={error}
      onChange={(checked) => setValue(field.key, checked ? "yes" : "")}
    >
      {field.statement}
      <RequiredMark />
    </CheckCell>
  );
}

export default function RfqField({ field }: { field: FieldDef }) {
  switch (field.kind) {
    case "choice":
      return <ChoiceField field={field} />;
    case "consent":
      return <ConsentField field={field} />;
    default:
      return <TextField field={field} />;
  }
}
