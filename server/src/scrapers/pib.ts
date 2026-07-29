import { categorize } from "./categorize.js";
import type { LiveUpdate, SourceDefinition } from "./types.js";

const FEED_URL = "https://pib.gov.in/RssMain.aspx?ModId=6&reg=3&lang=1";

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRss(xml: string): { title: string; link: string }[] {
  const items: { title: string; link: string }[] = [];
  const itemRe = /<item>(.*?)<\/item>/gs;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml))) {
    const block = match[1];
    const titleMatch = /<title>(.*?)<\/title>/s.exec(block);
    const linkMatch = /<link>(.*?)<\/link>/s.exec(block);
    if (titleMatch && linkMatch) {
      items.push({
        title: decodeEntities(titleMatch[1]),
        link: decodeEntities(linkMatch[1]),
      });
    }
  }
  return items;
}

async function fetchUpdates(): Promise<LiveUpdate[]> {
  const res = await fetch(FEED_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`PIB feed request failed with ${res.status}`);
  }
  const xml = await res.text();
  const fetchedAt = new Date().toISOString();

  return parseRss(xml)
    .slice(0, 25)
    .map((item, index) => ({
      id: `pib-${index}-${Buffer.from(item.link).toString("base64url").slice(0, 12)}`,
      sourceId: "pib",
      sourceName: "PIB - Press Information Bureau",
      sourceUrl: "https://pib.gov.in",
      title: item.title,
      link: item.link,
      category: categorize(item.title),
      fetchedAt,
    }));
}

export const pibSource: SourceDefinition = {
  id: "pib",
  name: "PIB - Press Information Bureau",
  url: "https://pib.gov.in",
  jurisdiction: "Central",
  checkFrequency: "Daily",
  fetch: fetchUpdates,
};
