type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Best-effort, per-instance limiter. Serverless instances do not share this state. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [entry, value] of buckets) if (value.resetAt <= now) buckets.delete(entry);
    }
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
