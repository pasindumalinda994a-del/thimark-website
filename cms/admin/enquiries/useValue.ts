"use client";

import { useFormFields } from "@payloadcms/ui";

export function useValue<T = unknown>(path: string) {
  return useFormFields(([fields]) => fields[path]?.value) as T | undefined;
}
