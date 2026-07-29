import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx";
const BASE_URL = "https://www.rbi.org.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL);
  if (!res.ok) {
    throw new Error(`RBI press releases request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $("a.link2").each((index, el) => {
    const title = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!title || !href) return;
    const link = href.startsWith("http")
      ? href
      : `${BASE_URL}/Scripts/${href.replace(/^\/?Scripts\//, "")}`;

    updates.push({
      id: `rbi-${index}-${Buffer.from(link).toString("base64url").slice(0, 12)}`,
      sourceId: "rbi",
      sourceName: "Reserve Bank of India",
      sourceUrl: BASE_URL,
      title,
      link,
      category: categorize(title),
      fetchedAt,
    });
  });

  return updates.slice(0, 25);
}

export const rbiSource: SourceDefinition = {
  id: "rbi",
  name: "Reserve Bank of India",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
