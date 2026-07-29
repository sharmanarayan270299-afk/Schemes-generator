import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://heavyindustries.gov.in/en";
const BASE_URL = "https://heavyindustries.gov.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`Ministry of Heavy Industries request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".region-whats-new .news_div .media_content p").each((index, el) => {
    const title = $(el).contents().eq(0).text().replace(/\s+/g, " ").trim();
    const href = $(el).find("a.tab_readmore2").attr("href");
    if (!title || !href) return;

    updates.push({
      id: `heavy-industries-${index}-${Buffer.from(href).toString("base64url").slice(0, 12)}`,
      sourceId: "heavy-industries",
      sourceName: "Ministry of Heavy Industries",
      sourceUrl: BASE_URL,
      title,
      link: href,
      category: categorize(title) === "General" ? "Production Incentives" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const heavyIndustriesSource: SourceDefinition = {
  id: "heavy-industries",
  name: "Ministry of Heavy Industries",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
