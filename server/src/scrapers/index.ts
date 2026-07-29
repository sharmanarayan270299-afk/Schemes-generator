import { sources } from "./registry.js";
import type { LiveUpdate } from "./types.js";

const CACHE_TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  updates: LiveUpdate[];
  errors: { sourceId: string; message: string }[];
  fetchedAt: string;
}

let cache: CacheEntry | null = null;
let inFlight: Promise<CacheEntry> | null = null;

async function fetchAll(): Promise<CacheEntry> {
  const results = await Promise.allSettled(sources.map((s) => s.fetch()));

  const updates: LiveUpdate[] = [];
  const errors: { sourceId: string; message: string }[] = [];

  results.forEach((result, i) => {
    const source = sources[i];
    if (result.status === "fulfilled") {
      updates.push(...result.value);
    } else {
      errors.push({ sourceId: source.id, message: String(result.reason) });
    }
  });

  updates.sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt));

  const entry: CacheEntry = { updates, errors, fetchedAt: new Date().toISOString() };
  cache = entry;
  return entry;
}

export async function getLiveUpdates(opts: { forceRefresh?: boolean } = {}): Promise<CacheEntry> {
  const isFresh = cache && Date.now() - new Date(cache.fetchedAt).getTime() < CACHE_TTL_MS;

  if (!opts.forceRefresh && isFresh) {
    return cache!;
  }
  if (inFlight) {
    return inFlight;
  }

  inFlight = fetchAll().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export { sources };
export type { LiveUpdate };
