const buckets = new Map<string, number[]>();

export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (buckets.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

export function resetRateLimits() {
  buckets.clear();
}
