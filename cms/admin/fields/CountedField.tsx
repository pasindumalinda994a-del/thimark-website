"use client";

import { TextareaField, TextField, useField } from "@payloadcms/ui";
import type { TextareaFieldClientProps, TextFieldClientProps } from "payload";

type Props = (TextFieldClientProps | TextareaFieldClientProps) & { max: number };

export function CountedField(props: Props) {
  const { max, ...fieldProps } = props;
  const { value } = useField<string>({ path: props.path });
  const length = typeof value === "string" ? value.length : 0;
  const state = length > max ? " is-over" : length > max * 0.9 ? " is-near" : "";

  return (
    <div className="tm-counted">
      {fieldProps.field.type === "textarea" ? (
        <TextareaField {...(fieldProps as TextareaFieldClientProps)} />
      ) : (
        <TextField {...(fieldProps as TextFieldClientProps)} />
      )}
      <span className={`tm-counted__count${state}`} aria-live="polite">
        {length}/{max}
      </span>
    </div>
  );
}
