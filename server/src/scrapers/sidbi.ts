import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://www.sidbi.in";
const BASE_URL = "https://www.sidbi.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`SIDBI request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".floating-slide .card-header a").each((index, el) => {
    const title = $(el).find(".latest-floatcontent").text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    if (!title || !href) return;

    updates.push({
      id: `sidbi-${index}-${Buffer.from(href).toString("base64url").slice(0, 12)}`,
      sourceId: "sidbi",
      sourceName: "SIDBI",
      sourceUrl: BASE_URL,
      title,
      link: href,
      category: categorize(title) === "General" ? "Gov. Investment Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const sidbiSource: SourceDefinition = {
  id: "sidbi",
  name: "SIDBI",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Weekly",
  fetch: fetchUpdates,
};
