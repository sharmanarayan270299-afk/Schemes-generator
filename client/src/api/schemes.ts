import type { CategoryCount, Scheme, Stats } from "../types";

const BASE = "/api";

export interface SchemeQuery {
  category?: string;
  status?: string;
  level?: string;
  search?: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchSchemes(query: SchemeQuery): Promise<{ count: number; schemes: Scheme[] }> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);
  if (query.level) params.set("level", query.level);
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return fetchJson(`${BASE}/schemes${qs ? `?${qs}` : ""}`);
}

export function fetchCategories(): Promise<CategoryCount[]> {
  return fetchJson(`${BASE}/categories`);
}

export function fetchStats(): Promise<Stats> {
  return fetchJson(`${BASE}/stats`);
}
