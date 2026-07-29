export interface LiveUpdate {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  link: string;
  category: string;
  fetchedAt: string;
}

export interface SourceInfo {
  id: string;
  name: string;
  url: string;
  jurisdiction: string;
  checkFrequency: "Daily" | "Weekly";
}

interface LiveUpdatesResponse {
  count: number;
  updates: LiveUpdate[];
  errors: { sourceId: string; message: string }[];
  fetchedAt: string;
}

export async function fetchLiveUpdates(forceRefresh = false): Promise<LiveUpdatesResponse> {
  const res = await fetch(`/api/live-updates${forceRefresh ? "?refresh=true" : ""}`);
  if (!res.ok) throw new Error(`live-updates request failed with ${res.status}`);
  return res.json();
}

export async function fetchLiveSources(): Promise<SourceInfo[]> {
  const res = await fetch("/api/live-updates/sources");
  if (!res.ok) throw new Error(`live-updates/sources request failed with ${res.status}`);
  return res.json();
}
