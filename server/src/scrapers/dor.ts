import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://dor.gov.in";
const BASE_URL = "https://dor.gov.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`Department of Revenue request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".marquee-content a.mq_a").each((index, el) => {
    const title = ($(el).attr("title") || $(el).text()).replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!title || !href) return;
    const link = new URL(href, `${BASE_URL}/`).toString();

    updates.push({
      id: `dor-${index}-${Buffer.from(link).toString("base64url").slice(0, 12)}`,
      sourceId: "dor",
      sourceName: "Department of Revenue",
      sourceUrl: BASE_URL,
      title,
      link,
      category: categorize(title) === "General" ? "Taxation" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const dorSource: SourceDefinition = {
  id: "dor",
  name: "Department of Revenue",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
