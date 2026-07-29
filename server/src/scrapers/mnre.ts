import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://mnre.gov.in/en/";
const BASE_URL = "https://mnre.gov.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`MNRE request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".newsticker .slides li a.with-urlchange").each((index, el) => {
    const title = $(el)
      .clone()
      .find("span")
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const href = $(el).attr("href");
    if (!title || !href) return;

    updates.push({
      id: `mnre-${index}-${Buffer.from(href).toString("base64url").slice(0, 12)}`,
      sourceId: "mnre",
      sourceName: "Ministry of New & Renewable Energy",
      sourceUrl: BASE_URL,
      title,
      link: href,
      category: categorize(title) === "General" ? "Gov. Subsidies" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const mnreSource: SourceDefinition = {
  id: "mnre",
  name: "Ministry of New & Renewable Energy",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
