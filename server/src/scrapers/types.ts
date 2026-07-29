import type { SchemeCategory } from "../types.js";

export interface LiveUpdate {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  link: string;
  category: SchemeCategory | "General";
  fetchedAt: string;
}

export interface SourceDefinition {
  id: string;
  name: string;
  url: string;
  jurisdiction: string;
  checkFrequency: "Daily" | "Weekly";
  fetch: () => Promise<LiveUpdate[]>;
}
