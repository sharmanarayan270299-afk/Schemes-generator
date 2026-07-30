import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://upeida.up.gov.in";
const BASE_URL = "https://upeida.up.gov.in";

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`UPEIDA request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $(".news-panel li.news-item a.adtext").each((index, el) => {
    const title = $(el)
      .clone()
      .find("span.dtype")
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const href = $(el).attr("href");
    if (!title || !href) return;
    const link = new URL(href, `${BASE_URL}/`).toString();

    updates.push({
      id: `upeida-${index}-${Buffer.from(link).toString("base64url").slice(0, 12)}`,
      sourceId: "upeida",
      sourceName: "UPEIDA (Uttar Pradesh)",
      sourceUrl: BASE_URL,
      title,
      link,
      category:
        categorize(title) === "General" ? "Central & State Gov. Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const upeidaSource: SourceDefinition = {
  id: "upeida",
  name: "UPEIDA (Uttar Pradesh)",
  url: BASE_URL,
  jurisdiction: "State (Uttar Pradesh)",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
