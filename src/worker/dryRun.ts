import { rssSources } from "../config/sources.js";
import { readEnv } from "../config/env.js";
import { createEventFromRawItem } from "../event/createEvent.js";
import { fetchRssSource } from "../feeds/rss.js";
import { isMarketRelevant } from "../filter/relevance.js";
import { formatTapeLine, formatTapeMarkdown } from "../format/eventTape.js";
import type { NewsEvent } from "../domain/types.js";
import { clusterFingerprint } from "../dedupe/fingerprint.js";
import { escalateStatusForSourceCount } from "../domain/status.js";

export interface DryRunResult {
  sourceCount: number;
  fetchedCount: number;
  relevantCount: number;
  lines: string[];
  markdownItems: string[];
  events: NewsEvent[];
  errors: string[];
}

export async function dryRun(limit = 10): Promise<DryRunResult> {
  const env = readEnv(process.env, { requireDatabaseUrl: false });
  const result: DryRunResult = {
    sourceCount: rssSources.length,
    fetchedCount: 0,
    relevantCount: 0,
    lines: [],
    markdownItems: [],
    events: [],
    errors: [],
  };
  const events: NewsEvent[] = [];

  for (const source of rssSources) {
    try {
      const items = await fetchRssSource(source);
      result.fetchedCount += items.length;

      for (const item of items) {
        const event = createEventFromRawItem(item);
        if (!isMarketRelevant(event, { maxAgeHours: env.maxItemAgeHours })) continue;
        events.push(event);
      }
    } catch (error) {
      result.errors.push(`${source.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const selectedEvents = selectDryRunEvents(events);
  const limitedEvents = selectedEvents.slice(0, limit);

  return {
    ...result,
    relevantCount: selectedEvents.length,
    lines: limitedEvents.map(formatTapeLine),
    markdownItems: limitedEvents.map(formatTapeMarkdown),
    events: limitedEvents,
  };
}

export function selectDryRunEvents(events: NewsEvent[]): NewsEvent[] {
  const clusters = new Map<
    string,
    {
      representative: NewsEvent;
      sourceIds: Set<string>;
    }
  >();

  for (const event of [...events].sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime())) {
    const cluster = clusterFingerprint(event.category, event.headline);
    const existing = clusters.get(cluster);

    if (!existing) {
      clusters.set(cluster, {
        representative: event,
        sourceIds: new Set([event.source.id]),
      });
      continue;
    }

    existing.sourceIds.add(event.source.id);
  }

  return Array.from(clusters.values())
    .map(({ representative, sourceIds }) => ({
      ...representative,
      status: escalateStatusForSourceCount(representative.status, sourceIds.size),
    }))
    .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
}
