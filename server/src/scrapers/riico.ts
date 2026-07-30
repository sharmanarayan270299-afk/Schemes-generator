import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://riico.co.in";
const BASE_URL = "https://riico.co.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`RIICO request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $("#News-slider .card.updatecard").each((index, el) => {
    const title = $(el).find(".dates p").first().text().replace(/\s+/g, " ").trim();
    const href = $(el).find(".viewall a").attr("href");
    if (!title || !href) return;

    updates.push({
      id: `riico-${index}-${Buffer.from(href).toString("base64url").slice(0, 12)}`,
      sourceId: "riico",
      sourceName: "RIICO (Rajasthan)",
      sourceUrl: BASE_URL,
      title,
      link: href,
      category:
        categorize(title) === "General" ? "Central & State Gov. Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const riicoSource: SourceDefinition = {
  id: "riico",
  name: "RIICO (Rajasthan)",
  url: BASE_URL,
  jurisdiction: "State (Rajasthan)",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
