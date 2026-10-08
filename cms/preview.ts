export const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

export function previewPath(path: string) {
  return `${SERVER_URL}/preview?path=${encodeURIComponent(path)}`;
}
