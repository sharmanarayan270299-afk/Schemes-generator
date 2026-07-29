import * as cheerio from "cheerio";
import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const PAGE_URL = "https://cbic-gst.gov.in";
const BASE_URL = "https://cbic-gst.gov.in";

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/^[“"]\s*/, "")
    .replace(/\s*[”"]$/, "")
    .trim();
}

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(PAGE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`CBIC-GST portal request failed with ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const fetchedAt = new Date().toISOString();

  const updates: LiveUpdate[] = [];
  $('.marquee span[style*="color: yellow"]').each((index, el) => {
    const title = cleanText($(el).clone().find("a").remove().end().text());
    if (!title || title.length < 15) return;
    const relHref = $(el).find("a").first().attr("href");
    const link = relHref ? new URL(relHref, `${BASE_URL}/`).toString() : BASE_URL;

    updates.push({
      id: `cbic-gst-${index}-${Buffer.from(title).toString("base64url").slice(0, 12)}`,
      sourceId: "cbic-gst",
      sourceName: "CBIC (Central Excise & Service Tax)",
      sourceUrl: BASE_URL,
      title,
      link,
      category: categorize(title) === "General" ? "Customs Schemes" : categorize(title),
      fetchedAt,
    });
  });

  return updates;
}

export const cbicGstSource: SourceDefinition = {
  id: "cbic-gst",
  name: "CBIC (Central Excise & Service Tax)",
  url: BASE_URL,
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
