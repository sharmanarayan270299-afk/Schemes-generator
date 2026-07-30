import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://www.midcindia.org/important-notice/";
const BASE_URL = "https://www.midcindia.org";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`MIDC request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".hntc a").each((index, el) => {
    const title = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!title || !href) return;

    updates.push({
      id: `midc-${index}-${Buffer.from(href).toString("base64url").slice(0, 12)}`,
      sourceId: "midc",
      sourceName: "MIDC (Maharashtra)",
      sourceUrl: BASE_URL,
      title,
      link: href,
      category:
        categorize(title) === "General" ? "Central & State Gov. Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates.slice(0, 30);
}

export const midcSource: SourceDefinition = {
  id: "midc",
  name: "MIDC (Maharashtra)",
  url: BASE_URL,
  jurisdiction: "State (Maharashtra)",
  checkFrequency: "Weekly",
  fetch: fetchUpdates,
};
