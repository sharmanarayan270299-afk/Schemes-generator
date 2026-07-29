import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://champions.gov.in/";
const BASE_URL = "https://champions.gov.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`CHAMPIONS Portal request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $("#newsslider ul.newsslider a").each((index, el) => {
    const title = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!title || !href) return;
    const link = href.startsWith("http") ? href : `${BASE_URL}${href}`;

    updates.push({
      id: `champions-${index}-${Buffer.from(link).toString("base64url").slice(0, 12)}`,
      sourceId: "champions",
      sourceName: "CHAMPIONS Portal",
      sourceUrl: BASE_URL,
      title,
      link,
      category: categorize(title) === "General" ? "MSME Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const championsSource: SourceDefinition = {
  id: "champions",
  name: "CHAMPIONS Portal",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
