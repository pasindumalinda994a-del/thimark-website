"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  MAX_FILES,
  MAX_FILE_MB,
  UPLOAD_FORMATS,
  fileExt,
  type Errors,
  type ServiceId,
  type Value,
  type Values,
} from "@/app/request-a-quote/rfq-schema";

export type UploadStatus = "uploading" | "processing" | "uploaded";

export type UploadItem = {
  id: string;
  file: File;
  name: string;
  ext: string;
  size: number;
  status: UploadStatus;
  progress: number;
  since: number;
};

export type RfqContextValue = {
  service: ServiceId;
  values: Values;
  errors: Errors;
  setValue: (key: string, value: Value) => void;
  uploads: UploadItem[];
  addFiles: (files: FileList | File[]) => string[];
  removeFile: (id: string) => void;
};

const RfqContext = createContext<RfqContextValue | null>(null);

export const RfqProvider = RfqContext.Provider;

export function useRfq() {
  const context = useContext(RfqContext);
  if (!context) throw new Error("useRfq must be used inside RfqProvider");
  return context;
}

const TICK_MS = 160;
const PROCESSING_MS = 750;

export function useUploadQueue() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const seq = useRef(0);
  const itemsRef = useRef(items);
  const active = items.some((item) => item.status !== "uploaded");

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setItems((current) =>
        current.map((item) => {
          if (item.status === "uploading") {
            const weight = item.size > 5 * 1024 * 1024 ? 0.55 : 1;
            const progress = Math.min(100, item.progress + (7 + Math.random() * 15) * weight);
            return progress >= 100
              ? { ...item, progress: 100, status: "processing", since: now }
              : { ...item, progress };
          }
          if (item.status === "processing" && now - item.since >= PROCESSING_MS) {
            return { ...item, status: "uploaded" };
          }
          return item;
        }),
      );
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [active]);

  const addFiles = useCallback<RfqContextValue["addFiles"]>((incoming) => {
    const rejected: string[] = [];
    const accepted: UploadItem[] = [];
    let room = MAX_FILES - itemsRef.current.length;

    for (const file of Array.from(incoming)) {
      const ext = fileExt(file.name);
      if (!UPLOAD_FORMATS.includes(ext)) {
        rejected.push(`${file.name} — .${ext || "?"} not accepted`);
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        rejected.push(`${file.name} — over ${MAX_FILE_MB} MB`);
        continue;
      }
      if (room <= 0) {
        rejected.push(`${file.name} — ${MAX_FILES} file limit`);
        continue;
      }
      room -= 1;
      seq.current += 1;
      accepted.push({
        id: `rfq-file-${seq.current}`,
        file,
        name: file.name,
        ext,
        size: file.size,
        status: "uploading",
        progress: 0,
        since: Date.now(),
      });
    }

    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
    return rejected;
  }, []);

  const removeFile = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reset = useCallback(() => setItems([]), []);

  return { items, addFiles, removeFile, reset };
}
