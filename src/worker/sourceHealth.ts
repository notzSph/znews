import { rssSources } from "../config/sources.js";
import { createEventFromRawItem } from "../event/createEvent.js";
import { fetchRssSource } from "../feeds/rss.js";
import { isMarketRelevant } from "../filter/relevance.js";

export interface SourceHealth {
  id: string;
  name: string;
  url: string;
  ok: boolean;
  fetched: number;
  relevant: number;
  futureDated: number;
  latestPublishedAt?: Date;
  error?: string;
}

export async function checkSources(): Promise<SourceHealth[]> {
  const results: SourceHealth[] = [];

  for (const source of rssSources) {
    try {
      const items = await fetchRssSource(source);
      const events = items.map(createEventFromRawItem);
      const relevant = events.filter((event) => isMarketRelevant(event, { maxAgeHours: 48 })).length;
      const now = Date.now();
      const futureDated = items.filter((item) => item.publishedAt.getTime() - now > 60 * 60 * 1000).length;
      const latestPublishedAt = items
        .map((item) => item.publishedAt)
        .sort((left, right) => right.getTime() - left.getTime())[0];

      results.push({
        id: source.id,
        name: source.name,
        url: source.url,
        ok: true,
        fetched: items.length,
        relevant,
        futureDated,
        latestPublishedAt,
      });
    } catch (error) {
      results.push({
        id: source.id,
        name: source.name,
        url: source.url,
        ok: false,
        fetched: 0,
        relevant: 0,
        futureDated: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export function formatSourceHealth(results: SourceHealth[]): string {
  return results
    .map((result) => {
      if (!result.ok) {
        return `FAIL ${result.id} - ${result.name} - ${result.error}`;
      }

      const latest = result.latestPublishedAt ? result.latestPublishedAt.toISOString() : "none";
      return `OK ${result.id} - ${result.name} - fetched=${result.fetched} relevant48h=${result.relevant} future=${result.futureDated} latest=${latest}`;
    })
    .join("\n");
}
