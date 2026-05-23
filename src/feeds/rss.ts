import { XMLParser } from "fast-xml-parser";
import type { NewsSource, RawNewsItem } from "../domain/types.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "text",
});

export async function fetchRssSource(source: NewsSource): Promise<RawNewsItem[]> {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent": "zNews/0.1 (+market-aware headline collector)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.name}: ${response.status} ${response.statusText}`);
  }

  return parseRss(await response.text(), source);
}

export function parseRss(xml: string, source: NewsSource): RawNewsItem[] {
  const parsed = parser.parse(xml) as RssDocument;
  const channelItems = parsed.rss?.channel?.item;
  const feedEntries = parsed.feed?.entry;
  const rdfItems = parsed["rdf:RDF"]?.item;
  const rawItems = toArray(channelItems ?? feedEntries ?? rdfItems);

  return rawItems
    .map((item) => normalizeFeedItem(item, source))
    .filter((item): item is RawNewsItem => item !== null);
}

function normalizeFeedItem(item: RssItem | AtomEntry, source: NewsSource): RawNewsItem | null {
  const title = readText(item.title);
  const url = readLink(item);
  const publishedAt = readDate(item);

  if (!title || !url || !publishedAt) return null;

  return {
    id: `${source.id}:${url}`,
    source,
    title,
    url,
    publishedAt,
    summary: readText(item.description) ?? readText(item.summary) ?? readText(item.content),
  };
}

function readText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && "text" in value && typeof value.text === "string") {
    return value.text.trim();
  }
  return undefined;
}

function readLink(item: RssItem | AtomEntry): string | undefined {
  if (typeof item.link === "string") return item.link.trim();
  if (Array.isArray(item.link)) {
    const alternate = item.link.find((link) => link.rel === "alternate") ?? item.link[0];
    return alternate?.href;
  }
  return item.link?.href;
}

function readDate(item: RssItem | AtomEntry): Date | undefined {
  const value = item.pubDate ?? item.published ?? item.updated ?? item["dc:date"];
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

interface RssDocument {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
  feed?: {
    entry?: AtomEntry | AtomEntry[];
  };
  "rdf:RDF"?: {
    item?: RssItem | RssItem[];
  };
}

interface RssItem {
  title?: unknown;
  link?: string | AtomLink | AtomLink[];
  description?: unknown;
  pubDate?: string;
  published?: string;
  updated?: string;
  summary?: unknown;
  content?: unknown;
  "dc:date"?: string;
}

interface AtomEntry extends RssItem {
  link?: AtomLink | AtomLink[];
}

interface AtomLink {
  href?: string;
  rel?: string;
}
